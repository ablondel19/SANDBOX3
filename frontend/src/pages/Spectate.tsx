import { game } from "./CoPage";
import {useNavigate, useNavigation, useParams} from "react-router-dom";

function SpectatePage () {
    const Navigate = useNavigate();

    game.socket.on('SpectateResult', (name:string) => {
        Navigate('/SpectateResult', {state: {name}});
    });

    return (
        <div>
            {game.Canvas()}
            <h1>Spectate Page</h1>
        </div>
    )
}

export default SpectatePage;