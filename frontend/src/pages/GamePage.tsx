import { game } from "./CoPage";
import {useNavigate} from "react-router-dom";
import Nav from "../components/NavBar";
import { gameInfo } from "../components/Canvas";
import { MatchHistoryDto, MatchResultDto } from "../dto/dto";
import { useEffect, useState } from "react";
import {GameWon} from "./GameResult";
import {GameLost} from "./GameResult";

const onProut = () => {
    console.log("prout");
}

function Fack(){
    console.log("fack");
    return (
        <div>
            <Nav/>
            <h1> fack </h1>
            <button onClick={onProut}>IM FUCKING READY</button>
        </div>
    )
}

function GamePage() {

    const [Won, setWon] = useState<boolean>(false);
    const [Lost, setLost] = useState<boolean>(false);
    const [Info, setInfo] = useState<MatchResultDto>(null);

    const Navigate = useNavigate();

    const onReady = () => {
        game.socket.emit('PlayerReady');
    }

    function GameRender(){
        return (<div>
            <Nav/>
            {game.Canvas()}
            <button onClick={onReady}>IM FUCKING READY</button>
        </div>)
    }

    useEffect(() => {
        if (!game.socket)
            return;
        game.socket.on('GameLost', (info:MatchResultDto) => {
            setLost(true);
            setInfo(info);
            setWon(false);
        });

        game.socket.on('GameWon',(info:MatchResultDto) => {
            setLost(false);
            setInfo(info);
            setWon(true);
        });
        return () => {
            game.socket.off('GameWon');
            game.socket.off('GameLost');
        }
    }, [Won, Lost, Info]);

    console.log(Won, Lost, Info);

    return (
        <div>
            {!Won && !Lost && game.socket && <GameRender/>}
            {Won && <GameWon id={Info.id} Player1={Info.Player1} Player2={Info.Player2} scoreX={Info.scoreX} scoreY={Info.scoreY}/> }
            {Lost && <GameLost id={Info.id} Player1={Info.Player1} Player2={Info.Player2} scoreX={Info.scoreX} scoreY={Info.scoreY} />}
            {!game.socket &&
            (<div>
                <h1>You got Disconnected</h1>
                <button onClick={() => Navigate('/')}>Back to Log</button>
            </div>)}
        </div>);
}

export default GamePage;