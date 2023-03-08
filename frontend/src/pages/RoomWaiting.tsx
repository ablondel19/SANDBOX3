
// need chat here too !!!
import NyanCat from '../assets/NyanCat.gif'
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import { FaPlay } from 'react-icons/fa';
import PewPew from '../assets/Pewpew.mp3';
import DiscordSound from '../assets/Discord.mp3';
import RohSound from '../assets/Rooooh.mp3';

function Pew() {
    const audio = new Audio(PewPew);
    audio.play();
}

function Discord() {
    const audio = new Audio(DiscordSound);
    audio.play();
}

function Roh() {
    const audio = new Audio(RohSound);
    audio.play();
}



// need chat here too !!!

function RoomWaiting () {

    return (
    <div>
        <div className='text-center'>
            <h1> Waiting : You will be redirect when a player will be found, until that, you can chat :)</h1>
        </div>
        <div className='flex-container'>
            <div className='mc-menu'>
                <div className='mc-button full'>
                    <button className="mc-button full" onClick={Pew}> PewPew </button>
                </div>
                <div className='mc-button full'>
                    <button className="mc-button full" onClick={Discord}> Discord ? </button>
                </div>
                <div className='mc-button full'>
                    <button className="mc-button full" onClick={Roh}> Thinkge ? PLEASE CLICK ONLY 1 TIMES </button>
                </div>
            </div>
        </div>
    </div>);
}

export default RoomWaiting