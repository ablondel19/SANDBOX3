import { useState } from "react";
import {Route, useNavigate, useNavigation} from "react-router-dom";
import { useLocation } from "react-router-dom";

function GameWon() {
    const Navigate = useNavigate();
    return (
        <div>
            <h1>YOU WON</h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}

function GameLost() {
    const Navigate = useNavigate();
    return (
        <div>
            <h1>YOU LOST</h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}

function GameDraw() {
    const Navigate = useNavigate();
    return (
        <div>
            <h1>You Drawed</h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}

function SpectateResult() {
    
    const location = useLocation();
    const Navigate = useNavigate();
    const WinnerName = location.state.name;
    return (
        <div>
            <h1> {WinnerName} is the Winner !!!!! </h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}


export {GameWon, GameLost, GameDraw, SpectateResult};
