import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DisplayErrors } from './DisplayErrors';

export const FriendList = () => {
  const [friendlist, setFriendList] = useState(null);
  const [errors, setErrors] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `http://localhost:3001/app/users/friendlist/${sessionStorage.getItem(
            'currentUser',
          )}`,
        )
        .then((response) => {
          setFriendList(response.data);
        })
        .catch((err) => {
          console.error(err.response.data);
          setErrors(err.response.data);
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <ul>
        {friendlist &&
          friendlist.map((friend) => (
            <li key={friend.login}>
              <p>
                {friend.login} {friend.status}
                {friend.avatar && (
                  <img
                    alt="avatar"
                    src={`data:image/jpeg;base64,${friend.avatar}`}
                    style={{ height: '2%', width: '2%' }}
                  />
                )}
              </p>
            </li>
          ))}
      </ul>
      <DisplayErrors errors={errors} />
    </div>
  );
};
