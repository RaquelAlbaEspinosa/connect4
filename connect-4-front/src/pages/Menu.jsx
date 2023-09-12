import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import axios from "axios";
import { saveLocalStorage } from "../localStorage/localStorage";

export const Menu = () => {
    const navigate = useNavigate();
    const { player, setBoard, setPlayerNumber } = useContext(Connect4Context);
    const createBoard = () => {
        axios
          .post(`http://localhost:8080/newBoard?playerId=${player.playerId}`)
          .then((res) => {
            setPlayerNumber(1);
            setBoard(res.data);

            saveLocalStorage("playerNumber", 1);
            saveLocalStorage("board", JSON.stringify(res.data));

            navigate(`/game/${res.data.boardId}`);
          })
          .catch((err) => console.log(err));
      };
      console.log(player);
  return (
    <>
      <Button onClick={() => {createBoard()}}>CREAR PARTIDA</Button>
      <Button onClick={() => navigate(`/games`)}>PARTIDAS EN CURSO</Button>
      <Button onClick={() => navigate(`/hist`)}>HISTÓRICO DE PARTIDAS</Button>
    </>
  );
};
