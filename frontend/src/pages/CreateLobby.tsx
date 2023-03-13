import { game } from "./CoPage";
import Nav from 'react-bootstrap/Nav';
import Navb from "../components/NavBar";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

function CreateLobbyPage(){
    
    const addLobby = () => {
        game.socket.emit('CreateLobby', (response: any) => {
            Store.addNotification({
                title: "Lobby",
                message: response,
                type: "default",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: true
                }
              });
        });
    }

    const addRainbowLobby = () => {
        game.socket.emit('CreateRainbowLobby', (response: any) =>{
            Store.addNotification({
                title: "Lobby",
                message: response,
                type: "default",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 3000,
                  onScreen: true
                }
              });
        });
    }
    const printLobby = () => {
        game.socket.emit('LobbyInfo');
    }

        return (
            <div>
            <ReactNotifications />
            <Navb/>
            <div className="flex-container">
                <div className="mc-menu">
                    <div className="mc-button full">
                        <Nav.Link onClick={addLobby} className="title">Create classic Lobby</Nav.Link>
                    </div>
                    <div className="mc-button full">
                        <Nav.Link onClick={addRainbowLobby} className="title">Create Rainbow Day Lobby</Nav.Link>
                    </div>
                    <div className="mc-button full">
                        <Nav.Link onClick={printLobby} className="title">Print Lobby</Nav.Link>
                    </div>
                </div>
            </div>
        </div>);
}

export default CreateLobbyPage;