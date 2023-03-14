import React from 'react';
import {Route, Routes} from "react-router-dom";
import ConnectionPage from "../pages/ConnectionPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import LobbyPage from "../pages/LobbyPage";
import GamePage from "../pages/GamePage";
import MovePage from "../pages/All";
import RoomWaiting from "../pages/RoomWaiting";
import SpectatePage from "../pages/Spectate";
import {GameWon} from "../pages/GameResult";
import {GameLost} from "../pages/GameResult";
import HomePage from '../pages/All';
import ProfilePage from '../pages/ProfilePage';
import SignUpPage from '../pages/SignUp';
import SignInPage from '../pages/SignIn';
import CreateLobbyPage from '../pages/CreateLobby';
import CoPage from "../pages/CoPage";
import SettingsPage from "../pages/SettingsPage";
import { SpectateResult } from '../pages/GameResult';
import CommunityPage from '../pages/Community';

function Pathing(){
    return (
        <Routes>
            <Route path='/Game' element={<GamePage/>}/>
            <Route path='/CoPage' element={<CoPage/>}/>
            <Route path='/' element={<ConnectionPage/>}/>
            <Route path='/Lobby' element={<LobbyPage/>}/>
            <Route path='/GameWon' element={<GameWon id={0} Player1={''} Player2={''} scoreX={0} scoreY={0}/>}/>
            <Route path='/HomePage' element={<HomePage/>}/>
            <Route path='/GameLost' element={<GameLost id={0} Player1={''} Player2={''} scoreX={0} scoreY={0}/>}/>
            <Route path='/SignUp' element={<SignUpPage/>}/>
            <Route path='/SignIn' element={<SignInPage/>}/>
            <Route path='/Profile' element={<ProfilePage/>}/>
            <Route path='/Spectate' element={<SpectatePage/>}/>
            <Route path='/Settings' element={<SettingsPage/>}/>
            <Route path='/RoomWaiting' element={<RoomWaiting/>}/>
            <Route path='/Leaderboard' element={<LeaderboardPage/>}/>
            <Route path='/CreateLobby' element={<CreateLobbyPage/>}/>
            <Route path='/SpectateResult' element={<SpectateResult id={0} Player1={''} Player2={''} scoreX={0} scoreY={0}/>}/>
            <Route path='/Community' element={<CommunityPage/>}/>
        </Routes>
    )
}
export default Pathing