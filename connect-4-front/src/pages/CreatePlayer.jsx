import axios from "axios";
import { useContext, useState } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import { saveLocalStorage } from "../localStorage/localStorage";
import "./createPlayer.css";

export const CreatePlayer = () => {
  const { setPlayer } = useContext(Connect4Context);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [boolean, setBoolean] = useState(true);
  const handleChange = (e) => {
    let { value } = e.target;
    setUserName(value);
    setBoolean(value.length < 3 ? true : false)
  };
  const createUser = () => {
    axios
      .post(`http://localhost:8080/newPlayer?name=${userName}`)
      .then((res) => {
        saveLocalStorage("player", JSON.stringify(res.data));
        setPlayer(res.data);
      })
      .catch((err) => console.log(err));
      
      navigate(`/menu`);
  };
  return (
      <Row className="createPlayer mx-0">
        <Col xs={12}>
          <Card className="cardPlayer">
            <Card.Title><h1>Create Player</h1></Card.Title>
            <Form>
              <Form.Group className="mb-3 formPlayer" controlId="formBasicName">
                <Form.Label>Elija nombre de jugador:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Introduzca un nombre de jugador"
                  name="userName"
                  onChange={handleChange}
                  value={userName?.userName}
                />
                <Button
                type="submit"
                onClick={createUser}
                disabled={boolean}
                className="buttonPlayer"
                >
                  CREAR
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>
  );
};
