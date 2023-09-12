package com.bosonit.formacion.connect4back.repositories;

import com.bosonit.formacion.connect4back.model.BoardHist;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardHistRepository extends R2dbcRepository<BoardHist, String> {
}
