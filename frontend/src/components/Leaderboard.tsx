import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(
        'http://localhost:3001/app/users/leaderboard',
      );
      setLeaderboard(result.data);
    }
    fetchData();
  }, []);

  return (
    <div>
        <ul>
          {leaderboard && leaderboard.map((item) => (
            <li key={item[0]}>
              <p>
                Login: {item[0]} Victories {item[1]} Rank: {item[2]}
              </p>
            </li>
          ))}
        </ul>
    </div>
  );
};
