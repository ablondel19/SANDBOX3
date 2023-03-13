import io from 'socket.io-client';
import { Gaming } from '../Canvas';
import {Server, Socket} from 'socket.io';
import { MatchResultDto } from '../users/users.dto';
import { isConstructorDeclaration } from 'typescript';

class Lobby {
    id: string;
    Players: string [];
    Instance : Gaming;
    Ready : string [];
    Spectators : string [];
    Rainbow : boolean;
    socketing: Map<string, Socket> = new Map<string, Socket>();
    constructor(id: string) {
        this.Instance = new Gaming(1000, 1000);
        this.Instance.intID = id;
        this.id = id;
        this.Players = [];
        this.Ready = [];
        this.Spectators = [];
        this.Rainbow = false;
    }
}

export class LobbyManager {
    LobbyList: Lobby[];
    Room : Server;

    constructor() {
        this.LobbyList = [];
    }
    createLobby(Mode: 'Rainbow' | 'Classic'): Lobby {
        const lobby = new Lobby(this.LobbyList.length.toString());
        this.LobbyList.push(lobby);
        if (Mode === 'Rainbow')
            lobby.Rainbow = true;
        lobby.Instance.getInfo().Balling.custom = lobby.Rainbow;
        return lobby;
    }
    JoinLobby(login: string, client: Socket) {

        let id = 0;
        if (this.isInLobby(login))
            throw new Error('Player already in lobby');
        let tLobby;
        if (this.LobbyList.length === 0)
            throw new Error('No lobby available');
        tLobby = this.LobbyList.at(id);
        while (tLobby) {

            if (tLobby && tLobby.Players.length < 2) {
                tLobby.id = id.toString();
                if (tLobby.Players.push(login)) {
                    tLobby.socketing.set(login, client);
                    client.join(tLobby.id);
                    tLobby.Instance.setRoom(this.Room);
                    
                    console.log('client joined lobby ' + tLobby.id.toString());
                    if (tLobby.Players.length === 2) {
                        tLobby.Instance.setRoom(this.Room);
                        tLobby.socketing.get(tLobby.Players[0])?.emit('Ready');
                        tLobby.socketing.get(tLobby.Players[1])?.emit('Ready');
                        return;
                    }
                    client.emit('Waiting Room');
                    return tLobby;
                }
            }
            id++;
            tLobby = this.LobbyList.at(id);
        }
        throw new Error('Lobby not found or full');
    }
    CreateMatchResult(Winner:string, Loser:string, score1:number, score2:number) {
        let matchHistory = new MatchResultDto();
        matchHistory.Player1 = Winner;
        matchHistory.Player2 = Loser;
        matchHistory.scoreX = score1;
        matchHistory.scoreY = score2;
        return matchHistory;
    }

    LeaveLobby(login: string) {
        let id = 0;
        let tLobby = this.LobbyList.at(id);
        if (tLobby)
        {
            const index = tLobby.Players.indexOf(login);
            if (index > -1) {
                if (tLobby.Instance.getInfo().Player1.name === login) {
                    if (tLobby.Instance.Disconnect(login) === "STOP")
                        tLobby.socketing.get(tLobby.Instance.getInfo().Player1.name)?.emit("Disconnected");
                    else
                        tLobby.socketing.get(tLobby.Instance.getInfo().Player1.name)?.emit("GameLost", this.CreateMatchResult(tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.score, tLobby.Instance.getInfo().Player1.score));
                    tLobby.socketing.get(tLobby.Instance.getInfo().Player2.name)?.emit("GameWon", this.CreateMatchResult(tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.score, tLobby.Instance.getInfo().Player1.score));
                    for (let i = 0; i < tLobby.Spectators.length; i++)
                        tLobby.socketing.get(tLobby.Spectators[i])?.emit("SpectateResult", tLobby.Instance.getInfo());
                    console.log('Player 1 won');
                }
                else if (tLobby.Instance.getInfo().Player2.name === login) {
                    if (tLobby.Instance.Disconnect(login) === "STOP")
                        tLobby.socketing.get(tLobby.Instance.getInfo().Player2.name)?.emit("Disconnected");
                    else
                    tLobby.socketing.get(tLobby.Instance.getInfo().Player2.name)?.emit("GameLost", this.CreateMatchResult(tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.score, tLobby.Instance.getInfo().Player2.score));
                    tLobby.socketing.get(tLobby.Instance.getInfo().Player1.name)?.emit("GameWon", this.CreateMatchResult(tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.score, tLobby.Instance.getInfo().Player2.score));
                    for(let i = 0; i < tLobby.Spectators.length; i++)
                        tLobby.socketing.get(tLobby.Spectators[0])?.emit("SpectateResult", tLobby.Instance.getInfo().Player1.name);
                    console.log('Player 2 won');
                }
                else
                    console.log("Draw");
            }
            tLobby.Players.splice(index, 1);
            tLobby.socketing.delete(login);
            tLobby.Instance.getInfo().Connected.splice(index, 1);
            if (tLobby.Ready.includes(login))
                tLobby.Ready.splice(index, 1);
            this.LobbyList.splice(this.LobbyList.indexOf(tLobby), 1);
        }
    }
    EndGame(login: string) {
        let id = 0;
        let tLobby = this.LobbyList.at(id);
        if (tLobby)
        {
            if (tLobby.Instance.getInfo().Player1.score === 7 && tLobby.Instance.getInfo().Player1.name === login) {
                tLobby.socketing.get(tLobby.Instance.getInfo().Player1.name)?.emit("GameWon", this.CreateMatchResult(tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.score, tLobby.Instance.getInfo().Player2.score));
                tLobby.socketing.get(tLobby.Instance.getInfo().Player2.name)?.emit("GameLost", this.CreateMatchResult(tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.score, tLobby.Instance.getInfo().Player2.score));
                for (let i = 0; i < tLobby.Spectators.length; i++)
                    tLobby.socketing.get(tLobby.Spectators[i])?.emit("SpectateResult", tLobby.Instance.getInfo());
                console.log('Player 1 won');
            }
            else if (tLobby.Instance.getInfo().Player2.score === 7 && tLobby.Instance.getInfo().Player2.name === login) {
                tLobby.socketing.get(tLobby.Instance.getInfo().Player2.name)?.emit("GameWon", this.CreateMatchResult(tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.score, tLobby.Instance.getInfo().Player1.score));
                tLobby.socketing.get(tLobby.Instance.getInfo().Player1.name)?.emit("GameLost", this.CreateMatchResult(tLobby.Instance.getInfo().Player2.name, tLobby.Instance.getInfo().Player1.name, tLobby.Instance.getInfo().Player2.score, tLobby.Instance.getInfo().Player1.score));
                for (let i = 0; i < tLobby.Spectators.length; i++)
                    tLobby.socketing.get(tLobby.Spectators[i])?.emit("SpectateResult", tLobby.Instance.getInfo());
                console.log('Player 2 won');
            }
            else
                return;
                
        }
    }

    printLobby() {
        console.log(this.LobbyList);
    }
    getLobbyInstance(id: string) {
        const tLobby = this.LobbyList.find((lobby) => lobby.id === id);
        if (tLobby)
            return tLobby.Instance;
        else
            console.log('Lobby/Instance not found');
        return undefined;
    }
    isInLobby(login: string) {
        const tLobby = this.LobbyList.find((lobby) => lobby.Players.includes(login));
        if (tLobby)
            return true;
        else
            return false;
    }
    getUserLobby(login: string) {
        const tLobbySpec = this.LobbyList.find((lobby) => lobby.Spectators.includes(login));
        const tLobby = this.LobbyList.find((lobby) => lobby.Players.includes(login));
        if (tLobbySpec)
            return tLobbySpec;
        if (tLobby)
            return tLobby;
        else
            throw new Error('Player not in a lobby');
    }
    SpectatorJoin(login: string, client: Socket) {
        if (this.isInLobby(login))
            throw new Error('Player already in lobby');
        let id = 0;
        let tLobby;
        tLobby = this.LobbyList.at(id);
        while (tLobby) {
            if (tLobby) {
                if (tLobby.Spectators.push(login)) {
                    tLobby.socketing.set(login, client);
                    client.join(tLobby.id);
                    tLobby.Instance.setRoom(this.Room);
                    return tLobby;
                }
            }
            id++;
            tLobby = this.LobbyList.at(id);
        }
        throw new Error('Lobby not found or full');
    }
    isSpectating(login: string) {
        const tLobby = this.LobbyList.find((lobby) => lobby.Spectators.includes(login));
        if (tLobby)
            return true;
        else
            return false;
    }
    LeaveSpectating(login: string) {
        const tLobby = this.LobbyList.find((lobby) => lobby.Spectators.includes(login));
        if (tLobby)
        {
            const index = tLobby.Spectators.indexOf(login);
            if (index > -1)
                tLobby.Spectators.splice(index, 1);
        }
    }
}
