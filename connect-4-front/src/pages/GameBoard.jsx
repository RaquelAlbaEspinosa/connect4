import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import "./gameBoard.css";
import axios from "axios";
import { deleteLocalStorage } from "../localStorage/localStorage";
import { io } from "socket.io-client";

export const GameBoard = () => {
  const navigate = useNavigate();
  const { setBoard, board, playerNumber } = useContext(Connect4Context);
  const [tablero, setTablero] = useState(null);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [kafkaMessage, setKafkaMessage] = useState("");

  useEffect(() => {
    if (tablero === null) {
      setTablero(JSON.parse(board?.movement));
    } else {
      setTablero(board?.movement);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9092");
        if (response.status === 200) {
          const data = response.data;
          setKafkaMessage(data.message);
        } else {
          console.error("Error al obtener mensaje de Kafka.");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    const interval = setInterval(fetchData, 5000); // Realiza una solicitud cada 5 segundos

    return () => clearInterval(interval);
  }, [board]);

  //const socket = io("http://localhost:9092");
  //  socket.on("partida", (mensaje) => {
  //    console.log("Mensaje de Kafka recibido:", mensaje);
  //    // Procesa el mensaje de Kafka en tiempo real en tu aplicación React
  //  });
  

  console.log(board);

  //console.log(tablero);

  const updateTablero = (column) => {
    for (let row = 5; row >= 0; row--) {
      if (tablero[column][row] == 0) {
        let tmp = tablero;
        tablero[column][row] = playerNumber;
        setBoard({ ...board, movement: tmp });

        row = 0;
      }
    }
  };

  const surrender = () => {
    axios
      .put(
        `http://localhost:8080/putPiece?column=-1&player=${playerNumber}&boardId=${board.boardId}`
      )
      .then((res) => {
        setBoard(res.data);

        deleteLocalStorage("board");
        deleteLocalStorage("playerNumber");

        navigate(`/menu`);
      })
      .catch((err) => console.log(err));
  };

  const putPiece = (column) => {
    axios
      .put(
        `http://localhost:8080/putPiece?column=${column}&player=${playerNumber}&boardId=${board.boardId}`
      )
      .then((res) => {
        console.log(res.status);
        if (res.status == 200) {
          updateTablero(column);
          setShowAlert(false);
        } else if (res.status == 201) {
          updateTablero(column);
          setShow(true);
          setShowAlert(false);
        } else if (res.status == 204) {
          setShowAlert(true);
        }
      });
  };

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
    <Container fluid className="h-100">
      <p>Game Board</p>
      <Button onClick={surrender}>RENDIRSE</Button>
      {showAlert && (
        <Alert key={"danger"} variant={"danger"}>
          La columna está llena, elige otra
        </Alert>
      )}
      <Row className="board m-auto">
        {tablero?.map((columna, number) => {
          return (
            <Col key={number} className="p-0" onClick={() => putPiece(number)}>
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
      <Modal show={show} onHide={() => navigate("/menu")}>
        <Modal.Header closeButton>
          <Modal.Title>HAS GANADO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Felicidades, has ganado Connect4. Ya puedes volver al trabajo.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/menu")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
