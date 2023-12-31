import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import { saveLocalStorage } from "../localStorage/localStorage";
import "./games.css";

export const Games = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [activeGames, setActiveGames] = useState();
  const { player, setBoard, setPlayerNumber } = useContext(Connect4Context);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/activeGames?pageNumber=${pageNumber}`)
      .then((res) => {
        setActiveGames(res.data);
      })
      .catch((err) => console.log(err));
  }, [pageNumber]);
  const joinBoard = (boardId) => {
    axios
        .get(`http://localhost:8080/joinBoard?playerId=${player?.playerId}&boardId=${boardId}`)
        .then((res) => {
            setPlayerNumber(2);
            setBoard(res.data);

            saveLocalStorage("playerNumber", 2);
            saveLocalStorage("board", JSON.stringify(res.data));
            
            navigate(`/game/${boardId}`);
        })
        .catch((err) => console.log(err))
  }
//   console.log(board);
  console.log(player);
  return (
    <div className="games">
      <h1>Games</h1>
      {activeGames?.length >= 1 ? (
        <Row>
          {activeGames.map((activeGame, index) => {
            return (
              <Col xs={12} md={6} lg={3} key={index}>
                <Card className="cardGames mb-2">
                  <Card.Body>
                    <Card.Title>{activeGame.boardId}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {activeGame.player1Name}
                    </Card.Subtitle>
                    <Button onClick={() => joinBoard(activeGame.boardId)}>UNIRSE</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <p>No hay juegos activos</p>
      )}
      <Row>
        <Col xs={12} className="buttonsGames">
          <Button onClick={() => setPageNumber(pageNumber - 1)}>-</Button>
          <Button onClick={() => navigate(`/menu`)}>MENÚ</Button>
          <Button onClick={() => setPageNumber(pageNumber + 1)}>+</Button>
        </Col>
      </Row>
    </div>
  );
};
