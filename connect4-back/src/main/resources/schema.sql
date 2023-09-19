CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS player ;

CREATE TABLE IF NOT EXISTS player (
    player_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    ip_player VARCHAR(255),
    board_id VARCHAR(255)
);

DROP TABLE IF EXISTS board ;

CREATE TABLE IF NOT EXISTS board (
    board_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player1_name VARCHAR(255),
    player1_ip VARCHAR(255),
    player2_name VARCHAR(255),
    player2_ip VARCHAR(255),
    movement VARCHAR(255),
    turn BOOLEAN,
    states VARCHAR(255)
);

DROP TABLE IF EXISTS boardhist ;

CREATE TABLE IF NOT EXISTS boardhist (
    board_hist_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player1_name VARCHAR(255),
    player1_ip VARCHAR(255),
    player2_name VARCHAR(255),
    player2_ip VARCHAR(255),
    winner_name VARCHAR(255),
    movement VARCHAR(255),
    date TIMESTAMP
);