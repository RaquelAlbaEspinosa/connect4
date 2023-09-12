import axios from "axios";
import { useContext, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Connect4Context } from "../context/Connect4Context";
import { saveLocalStorage } from "../localStorage/localStorage";

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
    <>
      <Card>
        <p>Create Player</p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Elija nombre de jugador:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduzca nombre"
              name="userName"
              onChange={handleChange}
              value={userName?.userName}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={createUser}
            disabled={boolean}
          >
            CREAR
          </Button>
        </Form>
      </Card>
    </>
  );
};
