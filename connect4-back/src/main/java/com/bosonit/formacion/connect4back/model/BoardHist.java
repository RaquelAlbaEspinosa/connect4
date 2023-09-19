package com.bosonit.formacion.connect4back.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Table(value = "boardhist")
public class BoardHist {
    @Id
    private UUID boardHistId;
    @Column(value = "player1_name")
    private String player1Name;
    @Column(value = "player1_ip")
    private String player1Ip;
    @Column(value = "player2_name")
    private String player2Name;
    @Column(value = "player2_ip")
    private String player2Ip;
    @Column(value = "winner_name")
    private String winnerName;
    private String movement;
    @Column("date")
    private LocalDateTime date;

    public BoardHist(String player1Name, String player1Ip, String player2Name, String player2Ip, String winnerName, String movement) {
        this.player1Name = player1Name;
        this.player1Ip = player1Ip;
        this.player2Name = player2Name;
        this.player2Ip = player2Ip;
        this.winnerName = winnerName;
        this.movement = movement;
        this.date = LocalDateTime.now();
    }
}
