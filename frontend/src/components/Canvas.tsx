import React, {useEffect, useRef} from 'react';
import io from "socket.io-client";

let canvas:any;
let running: boolean = false;
let context:any;

class Player
{
    x:number;
    y:number;
    width:number;
    height:number;
    color:string;
    score:number;
    min:number;
    max:number;
    speed:number;
    moveUp:boolean;
    moveDown:boolean;
    constructor(x:number, y:number, width:number, height:number, color:string, score:number, min:number, max:number, speed:number) {
        this.x = x;
        this.y = y - height / 2;
        this.width = width;
        this.height = height;
        this.color = color;
        this.score = score;
        this.min = min;
        this.max = max;
        this.speed = speed;
        this.moveDown = false;
        this.moveUp = false;
    }
    PaddleUp()
    {
        context.fillStyle = '#000000';
        context.fillRect(this.x, this.y, this.width, this.height);
        if (this.y - this.speed >= -10)
            this.y -= this.speed;
    }
    PaddleDown()
    {
        context.fillStyle = '#000000';
        context.fillRect(this.x, this.y, this.width,this.height)
        if (this.y + this.speed + this.height <= this.max + 10)
            this.y += this.speed;
    }
}

class Ball
{
    x:number;
    y:number;
    radius:number;
    speed:number;
    velocityX:number;
    velocityY:number;
    color:string;
    constructor(x:number, y:number, radius:number, speed:number, velocityX:number, velocityY:number, color:string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
    }
}

export class gameInfo{
    Balling:Ball;
    Player1:Player;
    Player2:Player;
    Connected:string[];
    Running:boolean;
    CDimension:any = {width: 0, height: 0};
    Lead: [string, Player];
    Loser: [string, Player];
    constructor(widths:number, heights:number){
        this.Running = false;
        this.Connected = [];
        this.Balling = new Ball((widths / 2), (heights / 2), 10, 10, 5, 0, 'red');
        this.Player1 = new Player(0, 500, 20, 100, '#0d35ca', 0, 0, heights, 10);
        this.Player2 = new Player(widths - 20, (heights / 2), 20, 100, '#05f315', 0, 0, heights, 10);
        this.CDimension = {width: widths, height: heights};
    }
    resetCanvas()
    {    
        this.Running = false;
        this.Connected = [];
        this.Balling = new Ball((this.CDimension.width / 2), (this.CDimension.height / 2), 10, 10, 5, 10, 'red');
        this.Player1 = new Player(0, 500, 20, 100, '#0d35ca', 0, 0, this.CDimension.height, 10);
        this.Player2 = new Player(this.CDimension.width - 20, (this.CDimension.height / 2), 20, 100, '#05f315', 0, 0, this.CDimension.height, 10);
    }
    copy(other:gameInfo)
    {
        this.Balling = other.Balling;
        this.Player1 = other.Player1;
        this.Player2 = other.Player2;
        this.CDimension = {width: other.CDimension.width, height: other.CDimension.height};
    }
}

export class Gaming{
    Info:gameInfo;
    socket:any;

    constructor(width: number, height: number) {
        this.Info = new gameInfo(width, height);
    }
    socketInit = () => {
        this.socket = io('http://localhost:3002', {extraHeaders: {Authorization: document.cookie}});
    }
    Draw = () => {
        this.socket.on('Ping', (data:gameInfo) => {
            this.Info.copy(data);
        });
        ResetBall();
        DrawScore(canvas.width / 4, canvas.height / 4, '#ffffff', this.Info.Player1.score.toString());
        DrawScore(3 * canvas.width / 4, canvas.height / 4, '#ffffff',this.Info.Player2.score.toString());
        DrawRec(this.Info.Player1.x, this.Info.Player1.y, this.Info.Player1.width, this.Info.Player1.height, this.Info.Player1.color);
        DrawRec(this.Info.Player2.x, this.Info.Player2.y, this.Info.Player2.width, this.Info.Player2.height, this.Info.Player2.color);
        DrawBall(this.Info.Balling.x, this.Info.Balling.y, this.Info.Balling.radius, this.Info.Balling.color);
    }
    Canvas = () => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        useEffect(() => {
            this.Info.resetCanvas();
            if (canvasRef.current) {
                canvas = canvasRef.current;
                context = canvas.getContext('2d');
                if (context) {
                    context.beginPath();
                    context.fillStyle = '#163eab';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                }
                setInterval(this.Draw, 1);
                canvas.tabIndex = 1;
                window.addEventListener('keydown', (e) => {
                    if (e.repeat)
                        return;
                    if ('ArrowUp' === e.key) {
                        console.log(e);
                        this.socket.emit('PaddleUp', true);
                    }
                    if ('ArrowDown' === e.key) {;
                        console.log(e);
                        this.socket.emit('PaddleDown', true)
                    }
                    console.log(e.key);
                });
                window.addEventListener('keyup', (e) => {
                    if (e.repeat)
                        return;
                    if ('ArrowUp' === e.key) {
                        console.log(e);
                        this.socket.emit('PaddleUp', false);
                    }
                    if ('ArrowDown' === e.key) {
                        console.log(e);
                        this.socket.emit('PaddleDown', false)
                    }
                    console.log(e);
                });
            }
        });
        return <canvas ref={canvasRef} height={this.Info.CDimension.height} width={this.Info.CDimension.height}/>;
    }
}

function DrawScore(x:number, y:number, color:string, text:string)
{
    context.fillStyle = color;
    context.font = '45px Arial';
    context.fillText(text, x, y)
}

function DrawRec(x: number, y: number, w: number, h: number, color:string)
{
    context.fillStyle = color;
    context.fillRect(x, y, w , h);
}

function DrawBall(x: number, y: number, r: number, color:string)
{
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

function ResetBall()
{
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}