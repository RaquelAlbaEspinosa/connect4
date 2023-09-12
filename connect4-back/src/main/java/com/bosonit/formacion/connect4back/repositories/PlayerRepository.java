package com.bosonit.formacion.connect4back.repositories;

import com.bosonit.formacion.connect4back.model.Player;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlayerRepository extends R2dbcRepository<Player, UUID> {
}
