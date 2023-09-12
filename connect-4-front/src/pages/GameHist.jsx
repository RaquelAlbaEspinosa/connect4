import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const GameHist = () => {
    const navigate = useNavigate();
    return(
        <>
            <p>Hist</p>
            <Button onClick={() => navigate(`/menu`)}>MENÚ</Button>
        </>
    );
}