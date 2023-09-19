import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./games.css";

export const GameHist = () => {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const [boardHist, setBoardHist] = useState(null);
    useEffect(() => {
        axios
        .get(`http://localhost:8080/getAllBoardHist?pageNumber=${pageNumber}`)
        .then((res) => {
            setBoardHist(res.data);
        })
        .catch((err) => console.log(err))
    }, [pageNumber]);
    const enterBoardHist = (id) => {
        navigate(`/hist/${id}`)
    };
    return(
        <div className="games">
            <h1>Hist</h1>
            {boardHist?.length >= 1 ? (
                <Row>
                {boardHist.map((boardHist, index) => {
                  return (
                    <Col xs={12} md={6} lg={3} key={index}>
                      <Card className="cardGames md-2">
                        <Card.Body>
                          <Card.Title>{boardHist.boardHistId}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {boardHist.player1Name} vs {boardHist.player2Name}
                          </Card.Subtitle>
                          <Button onClick={() => enterBoardHist(boardHist.boardHistId)}>VER</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
                </Row>
            ) : (
                <p>No hay partidas guardadas</p>
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
}