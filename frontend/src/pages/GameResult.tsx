import { useState } from "react";
import { set } from "react-hook-form";
import {Route, useNavigate, useNavigation} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { gameInfo } from "../components/Canvas";
import { MatchHistoryDto, MatchResultDto } from "../dto/dto";

function GameWon(props:MatchResultDto) {
    const Navigate = useNavigate();

    return (
        <div>
            <h1>You Won vs {props.Player2} : {props.scoreX - props.scoreY} </h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}

function GameLost(props:MatchResultDto) {
    const Navigate = useNavigate();
    return (
        <div>
            <h1>You Lost vs {props.Player2} : {props.scoreX - props.scoreY} </h1>
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
    const WinnerName = location.state.info;
    return (
        <div>
            <h1> {WinnerName} is the Winner !!!!! </h1>
            <button onClick={() => Navigate('/HomePage')}>Back to Main Menu</button>
        </div>
    );
}


export {GameWon, GameLost, GameDraw, SpectateResult};