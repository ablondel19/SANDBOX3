import Nav from '../components/NavBar';
import { Profile } from '../components/Profile';
import { game } from './CoPage';

function ProfilePage() {

  if (game.socket)
    {
        console.log("Home Page :)");
        game.socket.emit('isWaiting');
    }

  return (
    <div>
        <Nav />
        <h1>ProfilePage</h1>
        <Profile />
    </div>
  )
}

export default ProfilePage;