package com.bosonit.formacion.connect4back.application;

import com.bosonit.formacion.connect4back.model.BoardHist;
import com.bosonit.formacion.connect4back.model.BoardStates;
import com.bosonit.formacion.connect4back.model.Board;
import com.bosonit.formacion.connect4back.model.Player;
import com.bosonit.formacion.connect4back.repositories.BoardHistRepository;
import com.bosonit.formacion.connect4back.repositories.BoardRepository;
import com.bosonit.formacion.connect4back.repositories.PlayerRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.beans.Transient;
import java.util.Arrays;
import java.util.UUID;

@Service
public class ApplicationServiceImpl implements ApplicationService{
    @Autowired
    PlayerRepository playerRepository;
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    BoardHistRepository boardHistRepository;
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    ObjectMapper mapper = new ObjectMapper();
    @Override
    @Transient
    public Mono<Player> createPlayer(String name, String ip) {
        return playerRepository.save(new Player(name, ip));
    }

    @Override
    public Flux<Board> getActiveBoards(int pageNumber) {
        int offset = (pageNumber - 1) * 5;
        return boardRepository.findAllPaginated(5, offset);
    }

    @Override
    @Transient
    public Mono<Board> createBoard(UUID id) {
        return playerRepository.findById(id).flatMap(p -> {
            Board board1 = new Board(p.getName(), p.getIpPlayer());
            board1.setPlayer1Ip(p.getIpPlayer());
            board1.setPlayer1Name(p.getName());

            return boardRepository.save(board1).flatMap(savedBoard -> {
                p.setBoardId(savedBoard.getBoardId());
                return playerRepository.save(p).map(player -> savedBoard);
            });
        });
    }

    @Override
    public Mono<Board> joinBoard(UUID playerId, UUID boardId) {
        return boardRepository.findById(boardId)
                .flatMap(b -> playerRepository.findById(playerId)
                        .map(p -> {
                            p.setBoardId(b.getBoardId());
                            b.setPlayer2Name(p.getName());
                            b.setPlayer2Ip(p.getIpPlayer());
                            b.setStates(BoardStates.START);
                            playerRepository.save(p).subscribe();
                            return b;
                        }))
                .flatMap(boardRepository::save);
    }

    @Override
    public Mono<Integer> putPiece(Integer column, Integer player, UUID boardId) {
        return boardRepository.findById(boardId)
                .flatMap(b -> {
                    int[][] board = matrixConverter(b.getMovement());

                    if(column == -1) {
                        if(b.getPlayer2Name() == null){
                            return boardRepository.delete(b).thenReturn(201);
                        } else {
                        String winner = (player == 1) ? b.getPlayer2Name() : b.getPlayer1Name();
                        b.setStates((player == 1) ? BoardStates.WINNER2 : BoardStates.WINNER1);
                        return boardRepository.save(b)
                                .thenReturn(201)
                                .flatMap(result -> boardHistRepository.save(new BoardHist(b.getPlayer1Name(), b.getPlayer1Ip(),
                                                b.getPlayer2Name(), b.getPlayer2Ip(), winner, b.getMovement()))
                                        .then(boardRepository.delete(b)).thenReturn(201));
                        }
                    }

                    int row = findAvailableRow(board, column);

                    if (row == -1) {
                        return Mono.just(204);
                    }

                    board[column][row] = player;
                    b.setMovement(Arrays.deepToString(board));

                    if (checkWin(board, player)) {
                        String winner = (player == 1) ? b.getPlayer1Name() : b.getPlayer2Name();
                        b.setStates((player == 1) ? BoardStates.WINNER1 : BoardStates.WINNER2);
                        return boardRepository.save(b)
                                .thenReturn(201)
                                .flatMap(result -> boardHistRepository.save(new BoardHist(b.getPlayer1Name(), b.getPlayer1Ip(),
                                                b.getPlayer2Name(), b.getPlayer2Ip(), winner, b.getMovement()))
                                        .then(boardRepository.delete(b)).thenReturn(201));
                    } else if (checkDraw(board)) {
                        b.setStates(BoardStates.DRAW);
                        return boardRepository.save(b)
                                .thenReturn(201)
                                .flatMap(result -> boardHistRepository.save(new BoardHist(b.getPlayer1Name(), b.getPlayer1Ip(),
                                                b.getPlayer2Name(), b.getPlayer2Ip(), "", b.getMovement()))
                                        .then(boardRepository.delete(b)).thenReturn(201));
                    } else {
                        b.setTurn(!b.isTurn());
                        return boardRepository.save(b)
                                .thenReturn(200)
                                .doOnSuccess(result -> {
                                    try {
                                        kafkaTemplate.send("partida", mapper.writeValueAsString(b));
                                    } catch (JsonProcessingException e) {
                                        throw new RuntimeException(e);
                                    }
                                });
                    }
                });
    }
    private int findAvailableRow(int[][] board, int column) {
        for (int row = 5; row >= 0; row--) {
            if (board[column][row] == 0) {
                return row;
            }
        }
        return -1;
    }
    private boolean checkWin(int[][] board, Integer currentPlayer) {
        return checkVertical(board, currentPlayer) || checkHorizontal(board, currentPlayer) || checkDiagonal(board, currentPlayer);
    }
    private boolean checkVertical(int[][] board, Integer currentPlayer) {
        for (int col = 0; col < 7; col++) {
            for (int row = 0; row < 3; row++) {
                if (board[col][row] == currentPlayer &&
                        board[col][row + 1] == currentPlayer &&
                        board[col][row + 2] == currentPlayer &&
                        board[col][row + 3] == currentPlayer) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean checkHorizontal(int[][] board, Integer currentPlayer) {
        for (int col = 0; col < 4; col++) {
            for (int row = 0; row < 6; row++) {
                if (board[col][row] == currentPlayer &&
                        board[col + 1][row] == currentPlayer &&
                        board[col + 2][row] == currentPlayer &&
                        board[col + 3][row] == currentPlayer) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean checkDiagonal(int[][] board, Integer currentPlayer) {
        for (int col = 0; col < 4; col++) {
            for (int row = 0; row < 3; row++) {
                if (board[col][row] == currentPlayer &&
                        board[col + 1][row + 1] == currentPlayer &&
                        board[col + 2][row + 2] == currentPlayer &&
                        board[col + 3][row + 3] == currentPlayer) {
                    return true;
                }
                if (board[col][row + 3] == currentPlayer &&
                        board[col + 1][row + 2] == currentPlayer &&
                        board[col + 2][row + 1] == currentPlayer &&
                        board[col + 3][row] == currentPlayer) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean checkDraw (int[][] board){
        for (int[] col : board) {
            for (int i : col) {
                if (i == 0) {
                    return false;
                }
            }
        }
        return true;
    }

    private int[][] matrixConverter (String cadena) {
        cadena = cadena.substring(1, cadena.length() - 1);

        String[] filas = cadena.split("],");

        int[][] matrizBidimensional = new int[filas.length][];

        for (int i = 0; i < filas.length; i++) {
            String fila = filas[i];

            String[] elementos = fila.replaceAll("\\[|\\]", "").split(",");

            matrizBidimensional[i] = new int[elementos.length];

            for (int j = 0; j < elementos.length; j++) {
                matrizBidimensional[i][j] = Integer.parseInt(elementos[j].trim());
            }
        }
        return matrizBidimensional;
    }
}
