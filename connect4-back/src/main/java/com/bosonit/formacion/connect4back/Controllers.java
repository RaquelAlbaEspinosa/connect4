package com.bosonit.formacion.connect4back;

import com.bosonit.formacion.connect4back.application.ApplicationService;
import com.bosonit.formacion.connect4back.model.Board;
import com.bosonit.formacion.connect4back.model.BoardHist;
import com.bosonit.formacion.connect4back.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.UUID;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9092"})
@RestController
@RequestMapping()
public class Controllers {
    @Autowired
    ApplicationService applicationService;
    @Autowired
    KafkaMessageService kafkaMessageService;
    @Autowired
    KafkaProducerService kafkaProducerService;
    @PostMapping("/newPlayer")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Player> createPlayer (@RequestParam String name, ServerWebExchange exchange){
    String ip = Objects.requireNonNull(exchange.getRequest().getRemoteAddress()).getHostString();
    return applicationService.createPlayer(name, ip);
    }

    @GetMapping("/activeGames")
    @ResponseStatus(HttpStatus.OK)
    public Flux<Board> getActiveBoards(@RequestParam int pageNumber){
        return applicationService.getActiveBoards(pageNumber);
    }
    @PostMapping("/newBoard")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Board> createBoard (@RequestParam UUID playerId){
        return applicationService.createBoard(playerId);
    }
    @GetMapping("/joinBoard")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Board> joinBoard (@RequestParam UUID playerId, @RequestParam UUID boardId){
        return applicationService.joinBoard(playerId, boardId);
    }
    @PutMapping("/putPiece")
    public Mono<ResponseEntity<Void>> putPiece(
            @RequestParam Integer column,
            @RequestParam Integer player,
            @RequestParam UUID boardId
    ) {
        return applicationService.putPiece(column, player, boardId)
                .map(statusCode -> {
                    if (statusCode == 201) {
                        return ResponseEntity.status(HttpStatus.CREATED).build();
                    } else if (statusCode == 204) {
                        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
                    } else {
                        return ResponseEntity.status(HttpStatus.OK).build();
                    }
                });
    }
    @GetMapping("/getAllBoardHist")
    @ResponseStatus(HttpStatus.OK)
    public Flux<BoardHist> getBoardHist(@RequestParam int pageNumber){
        return applicationService.getBoardHist(pageNumber);
    }
    @GetMapping("/getOneBoardHist")
    @ResponseStatus(HttpStatus.OK)
    public Mono<BoardHist> getOneBoardHist (@RequestParam UUID id) {
        return applicationService.getOneBoardHist(id);
    }
    @GetMapping("/latestMessage")
    public ResponseEntity<String> getLatestKafkaMessage() {
        String latestMessage = kafkaMessageService.getLatestMessage();
        if (latestMessage != null) {
            return ResponseEntity.ok(latestMessage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteLatestMessage")
    public void deleteLatestMessage() {
        kafkaProducerService.deleteMessage();
    }
}
