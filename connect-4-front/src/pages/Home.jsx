import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteLocalStorage } from "../localStorage/localStorage";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./home.css";

export const Home = () => {

    const navigate = useNavigate();
    useEffect(() => {
        deleteLocalStorage("player");
        deleteLocalStorage("board");
        deleteLocalStorage("playerNumber");
    }, [])
    
    return (
        <Container fluid>
            <Row className="home">
                <Col xs={12} className="homeCol">
                    <h1 className="title">Bienvenid@ a CONNECT4</h1>
                </Col>
                <Col xs = {12} className="homeCol">
                    <Button className="homeButton" onClick={() => navigate(`/player`)}><p>EMPIEZA TU AVENTURA</p></Button>
                </Col>
                <div className="snow"></div>
            </Row>
        </ Container>
    );
}