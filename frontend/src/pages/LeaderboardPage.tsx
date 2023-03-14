import { Card } from '@mantine/core';
import { Leaderboard } from '../components/Leaderboard';
import Nav from '../components/NavBar';
import {game} from './CoPage';
import "../assets/Leadb.css"

function LeaderboardPage() {
  if (game.socket) {
    console.log("Home Page :)");
    game.socket.emit('isWaiting');
  }
  
  // const LeaderboardHeader = () => {
  //   return (
    //     )
    //   }
    //   const ColumnHeader = () => (
      //     <div className="row colheader">
      //         <Leaderboard />
      //       </div>
      //   ); 
      
      return (
        <div>
        <Nav />
          <Card shadow="sm" p="lg" radius="md" className='card' withBorder>
          <h1 className="card-title text-center">Leaderboard</h1>
          <Leaderboard />
           </Card>
      </div>
  )
}

export default LeaderboardPage;