import { FriendList } from '../components/FriendsList';
import Nav from '../components/NavBar';

function FriendsPage() {
  return (
    <div>
        <Nav />
        <h1>Friends</h1>
        <FriendList />
    </div>
  )
}

export default FriendsPage;