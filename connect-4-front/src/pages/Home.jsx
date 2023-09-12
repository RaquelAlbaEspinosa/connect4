import { useNavigate } from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate();
    return (
        <>
            <p>Bienvenid@ a CONNECT4</p>
            <button onClick={() => navigate(`/player`)}>EMPIEZA TU AVENTURA</button>
        </>
    );
}