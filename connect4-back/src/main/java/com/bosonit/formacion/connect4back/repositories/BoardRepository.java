package com.bosonit.formacion.connect4back.repositories;

import com.bosonit.formacion.connect4back.model.Board;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface BoardRepository extends R2dbcRepository<Board, UUID> {
    @Query("SELECT * FROM board WHERE states = 'WAITING' LIMIT :pageSize OFFSET :offset")
    Flux<Board> findAllPaginated(int pageSize, int offset);
}
