/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './App.css';
import Pathing from "./components/Path";
import 'bootstrap/dist/css/bootstrap.min.css'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


function App() {
    return (
        <div>
            <Pathing />
        </div>
    );
}

export default App;