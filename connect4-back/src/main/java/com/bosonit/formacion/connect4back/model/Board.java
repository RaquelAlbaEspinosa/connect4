package com.bosonit.formacion.connect4back.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.util.Arrays;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class Board {
    @Id
    @Column(value = "board_id")
    private UUID boardId;
    @Column(value = "player1_name")
    private String player1Name;
    @Column(value = "player1_ip")
    private String player1Ip;
    @Column(value = "player2_name")
    private String player2Name;
    @Column(value = "player2_ip")
    private String player2Ip;
    private String movement;
    private boolean turn;
    private BoardStates states;
    public Board (String player1Name, String player1Ip){
        this.player1Name = player1Name;
        this.player1Ip = player1Ip;
        this.states = BoardStates.WAITING;
        this.movement = Arrays.deepToString(new int[7][6]);
        this.turn = false;
    }
}
