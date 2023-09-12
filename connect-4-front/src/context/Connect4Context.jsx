import { createContext, useEffect, useState } from "react";
import { getLocalStorage } from "../localStorage/localStorage";

export const Connect4Context = createContext();

export const Connect4Provider = (props) => {
    const [player, setPlayer] = useState();
    //const [opponent, setOpponent] = useState();
    const [playerNumber, setPlayerNumber] = useState(0);
    const [board, setBoard] = useState();
    const [game, setGame] = useState();

    useEffect(() => {
        const player = getLocalStorage("player");
        const playerNumber = getLocalStorage("playerNumber")
        const board = getLocalStorage("board");

        setPlayer(JSON.parse(player));
        setPlayerNumber(JSON.parse(playerNumber));
        setBoard(JSON.parse(board));
    }, []);

    return (
        <Connect4Context.Provider
            value = {{player, setPlayer, board, setBoard, game, setGame, playerNumber, setPlayerNumber}}>
                {props.children}
        </Connect4Context.Provider>
    );
};