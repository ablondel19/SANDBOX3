import { game } from "./CoPage";
import { useState } from "react";
import { MatchResultDto } from "../dto/dto";
import { SpectateResult } from "./GameResult";
import Nav from "../components/NavBar";

function GameRender(){
    return(
        <div>
            <Nav/>
            {game.Canvas()}
            <h1>Spectate Page</h1>
        </div>);
}

function SpectatePage () {

    const [end, setEnd] = useState(false);
    const [Info, setInfo] = useState<MatchResultDto>(null);

    game.socket.on('SpectateResult', (info:MatchResultDto) => {
        setEnd(true);
        setInfo(info);
    });

    return (
        <div>
            {!end && <GameRender/>}
            {end && <SpectateResult id={Info.id} Player1={Info.Player1} Player2={Info.Player2} scoreX={Info.scoreX} scoreY={Info.scoreY} />}
        </div>
    )
}

export default SpectatePage;