import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { CreatePlayer } from "../pages/CreatePlayer";
import { GameBoard } from "../pages/GameBoard";
import { Games } from "../pages/Games";
import { Container } from "react-bootstrap";
import { Menu } from "../pages/Menu";
import { GameHist } from "../pages/GameHist";

 export const Connect4App = () => {
    return (
        <div>
            <Container fluid>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/player" element={<CreatePlayer />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/game/:id" element={<GameBoard />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/hist" element={<GameHist />} />
                    </Routes>
                </BrowserRouter>
            </Container>
        </div>
    );
 };