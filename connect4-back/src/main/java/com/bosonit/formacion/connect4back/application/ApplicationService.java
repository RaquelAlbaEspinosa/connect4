package com.bosonit.formacion.connect4back.application;

import com.bosonit.formacion.connect4back.model.Board;
import com.bosonit.formacion.connect4back.model.BoardHist;
import com.bosonit.formacion.connect4back.model.Player;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ApplicationService {
    Mono<Player> createPlayer (String name, String ip);
    Flux<Board> getActiveBoards(int pageNumber);
    Mono<Board> createBoard (UUID id);
    Mono<Board> joinBoard (UUID playerId, UUID boardId);
    Flux<BoardHist> getBoardHist(int pageNumber);
    Mono<BoardHist> getOneBoardHist (UUID id);
    Mono<Integer> putPiece (Integer position, Integer player, UUID boardId);
}
