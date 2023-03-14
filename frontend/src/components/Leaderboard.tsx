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
            <h4 key={item[0]}>
              <p>
              Rank  [{item[2]}] - {item[0]} : Victories {item[1]}
              </p>
            </h4>
          ))}
        </ul>
    </div>
  );
};
