package com.bosonit.formacion.connect4back.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class Player {
    @Id
    @Column(value = "player_id")
    private UUID playerId;
    private String name;
    @Column(value = "ip_player")
    private String ipPlayer;
    @Column(value = "board_id")
    private UUID boardId;
    public Player(String name, String ipPlayer){
        this.name = name;
        this.ipPlayer = ipPlayer;
    }
}
