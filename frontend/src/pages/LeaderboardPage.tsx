import { Leaderboard } from '../components/Leaderboard';
import Nav from '../components/NavBar';
import {game} from './CoPage';
import "../assets/Leadb.css"

function LeaderboardPage() {
    if (game.socket) {
        console.log("Home Page :)");
        game.socket.emit('isWaiting');
    }

    const LeaderboardHeader = () => {
      return (
        <div className="leadheader">
            <h2>Leaderboard</h2>
        </div>
      )
    }
    const ColumnHeader = () => (
      <div className="row colheader">
          <Leaderboard />
        </div>
    ); 

    return (
      <div>
        <Nav />
        <div className='container'>
          <LeaderboardHeader />
          <ColumnHeader/>
        </div>
      </div>
  )
}

export default LeaderboardPage;