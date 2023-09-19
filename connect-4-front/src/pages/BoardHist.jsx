import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./gameBoard.css";

export const BoardHist = () => {
    const navigate = useNavigate();
    const [boardHist, setBoardHist] = useState();
    const [movements, setMovements] = useState();
    const { id } = useParams();
    useEffect(() => {
        axios
        .get(`http://localhost:8080/getOneBoardHist?id=${id}`)
        .then((res) => {
            setBoardHist(res.data);
            setMovements(JSON.parse(res.data.movement));
        })
        .catch((err) => console.log(err))
    }, [])

    console.log(boardHist);

    const checkPlayer = (celda) => {
        let result = "";
        if (celda == 1) {
          result = "player1";
        } else if (celda == 2) {
          result = "player2";
        }
        return result;
      };
    return (
        <Row className="mx-0 p-4">
          <Col>
          <h2 className="text-center">{boardHist?.player1Name} vs {boardHist?.player2Name}</h2>
          </Col>
          <Col xs={12}>
          <Row className="board m-auto">
            {movements?.map((columna, number) => {
              return (
                <Col key={number} className="p-0">
                  {columna.map((celda, index) => {
                    return (
                      <div key={index} className="celda">
                        <div className={`${checkPlayer(celda)} ficha`}></div>
                      </div>
                    );
                  })}
                </Col>
              );
            })}
          </Row>
          </Col>
          <Col className="surrenderButton d-flex justify-content-center p-3">
            <Button onClick={() => navigate("/hist")} className="surrenderBtn">VER OTRAS PARTIDAS</Button>
          </Col>
        </Row>
    );
}