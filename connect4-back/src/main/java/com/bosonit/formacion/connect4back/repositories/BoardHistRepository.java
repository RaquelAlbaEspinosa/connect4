package com.bosonit.formacion.connect4back.repositories;

import com.bosonit.formacion.connect4back.model.Board;
import com.bosonit.formacion.connect4back.model.BoardHist;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface BoardHistRepository extends R2dbcRepository<BoardHist, UUID> {
    @Query("SELECT * FROM boardhist LIMIT :pageSize OFFSET :offset")
    Flux<BoardHist> findAllPaginated(int pageSize, int offset);
}
