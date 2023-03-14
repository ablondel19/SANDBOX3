import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gaming } from '../components/Canvas';
import HomePage from './All';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { TIMEOUT } from 'dns';
import { time } from 'console';

export var game = new Gaming(1000, 1000);


function connected (){
    Store.addNotification({
        title: "Error",
        message: "Invalid credentials",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true
        }
      });
}

function CoPage(){

    if (game.socket)
    {
        game.socket.emit('Disconnect');
        game.socket.disconnect();
        game.socket = null;
    }
    
    game.socketInit();
    const navigate = useNavigate();

    return (
        <div>
            <ReactNotifications />
            <HomePage/>
        </div>
    );
}

export default CoPage;
