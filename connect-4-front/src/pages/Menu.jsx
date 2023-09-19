import { useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import axios from "axios";
import { saveLocalStorage } from "../localStorage/localStorage";
import "./menu.css";

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
    <Row className="menu mx-0">
      <Col xs={12} className="menuButton">
        <Button onClick={() => {createBoard()}}>CREAR PARTIDA</Button>
      </Col>
      <Col xs={12} className="menuButton">
        <Button onClick={() => navigate(`/games`)}>PARTIDAS EN CURSO</Button>
      </Col>
      <Col xs={12} className="menuButton">
        <Button onClick={() => navigate(`/hist`)}>HISTÓRICO DE PARTIDAS</Button>
      </Col>
    </Row>
  );
};
