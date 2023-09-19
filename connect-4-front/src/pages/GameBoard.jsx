import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import "./gameBoard.css";
import axios from "axios";
import {
  deleteLocalStorage,
  saveLocalStorage,
} from "../localStorage/localStorage";

export const GameBoard = () => {
  const navigate = useNavigate();
  const { setBoard, board, playerNumber } = useContext(Connect4Context);
  const [tablero, setTablero] = useState(null);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // const [pieceBool, setPieceBool] = useState(false);
  // const [intervalBool, setIntervalBool] = useState(false);
  const [cosa, setCosa] = useState(false);
  const [currentRow, setCurrentRow] = useState(-1);
  const [pieceChangeBool, setPieceChangeBool] = useState(false);

  const win = {
    title: "HAS GANADO",
    body: "Felicidades, has ganado Connect4.",
  };

  const lose = {
    title: "HAS PERDIDO",
    body: "Lo siento, has perdido Connect4.",
  };

  const draw = {
    title: "EMPATE",
    body: "Ninguno ha ganado",
  };

  useEffect(() => {
    if (tablero === null) {
      setTablero(JSON.parse(board?.movement));
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/latestMessage");
        if (response.status === 200) {
          if (response.data != "") {
            setBoard(response.data);
            saveLocalStorage("board", JSON.stringify(response.data));
            setTablero(JSON.parse(response.data.movement));
          }
          if (
            response.data.states === "WINNER1" ||
            response.data.states === "WINNER2" ||
            response.data.states === "DRAW"
          ) {
            clearInterval(interval);
            setShow(true);
            setShowAlert(false);
          }
        } else {
          console.error("Error al obtener mensaje de Kafka.");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    const interval = setInterval(fetchData, 1000);
  }, []);

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
  const animateTablero = (column) => {
    if (tablero[column].includes(0)) {
      const cosita = document.getElementsByClassName("ficha" + column);
      let dropHeight = 480;
      for (let row = 5; row >= 0; row--) {
        if (tablero[column][row] == 0) {
          // setCurrentRow(row);
          document.documentElement.style.setProperty('--drop-height', dropHeight + "px");
          row = 0;
        }
        dropHeight -= 80;
      }
      if (playerNumber == 1) {
        cosita[0].classList.add("player1", "player-drop");
      } else if (playerNumber == 2) {
        cosita[0].classList.add("player2", "player-drop");
      }
    } else {
      putPiece(column);
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
        if (res.status == 200) {
          updateTablero(column);
          setShowAlert(false);
        } else if (res.status == 201) {
          updateTablero(column);
          setShowAlert(false);
        } else if (res.status == 204) {
          setShowAlert(true);
        }
      });
  };

  const closeGame = () => {
    axios
      .delete(`http://localhost:8080/deleteLatestMessage`)
      .catch((err) => console.log(err));

    deleteLocalStorage("board");
    navigate("/menu");
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

  const endAnimation = (column) => {
    setCosa(false);
    const cosita = document.getElementsByClassName("ficha" + column);
    cosita[0].classList.contains("player1")
      ? cosita[0].classList.remove("player1", "player-drop")
      : cosita[0].classList.remove("player2", "player-drop");
    putPiece(column);
  };

  return (
    <Row className="mx-0">
      <Col
        xs={12}
        md={6}
        className="surrenderButton d-flex justify-content-center align-items-center p-3"
      >
        <Button onClick={surrender} className="surrenderBtn">
          RENDIRSE
        </Button>
      </Col>
      <Col xs={12} md={6} className="names">
        <h2 className="text-center">
          {board?.player1Name} vs {board?.player2Name}
        </h2>
      </Col>
      <Col xs={12}>
        {showAlert && (
          <Alert key={"danger"} variant={"danger"}>
            La columna está llena, elige otra
          </Alert>
        )}
      </Col>
      <Col xs={12}>
        <Row className="board m-auto">
          {tablero?.map((columna, number) => {
            return (
              <Col
                key={number}
                className={`p-0 d-flex flex-column align-items-center 
                ${cosa ?? "ficha" + number}`}
                onClick={() => {
                  animateTablero(number);
                  setCosa(true);
                }}
              >
                <div
                  className={`chip ${"ficha" + number}`}
                  key={number}
                  onAnimationEnd={() => endAnimation(number)}
                ></div>
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
      <Modal show={show} onHide={closeGame}>
        <Modal.Header closeButton className="d-flex justify-content-center">
          <Modal.Title>
            {((board.states === "WINNER1" && playerNumber === 1) ||
              (board.states === "WINNER2" && playerNumber === 2)) &&
              win.title}
            {((board.states === "WINNER1" && playerNumber === 2) ||
              (board.states === "WINNER2" && playerNumber === 1)) &&
              lose.title}
            {board.states === "DRAW" && draw.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          {((board.states === "WINNER1" && playerNumber === 1) ||
            (board.states === "WINNER2" && playerNumber === 2)) &&
            win.body}
          {((board.states === "WINNER1" && playerNumber === 2) ||
            (board.states === "WINNER2" && playerNumber === 1)) &&
            lose.body}
          {board.states === "DRAW" && draw.body}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button onClick={closeGame} className="surrenderBtn">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={board.states === "WAITING"}>
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>EN ESPERA</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          Esperando al segundo jugador...
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button onClick={surrender} className="surrenderBtn">
            TERMINAR PARTIDA
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={
          board.states === "START" &&
          ((board.turn && playerNumber === 1) ||
            (!board.turn && playerNumber === 2))
        }
      >
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>EN ESPERA</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          Es el turno del otro jugador
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button onClick={surrender} className="surrenderBtn">
            RENDIRSE
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};
