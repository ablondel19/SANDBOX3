import { useEffect, useState } from 'react';
import axios from 'axios';
import { DisplayErrors } from './DisplayErrors';
import { Card, Progress, Notification } from '@mantine/core';
import { AiFillEdit } from 'react-icons/ai';
import { showNotification } from '@mantine/notifications';
import toast from 'react-hot-toast';
import { notify } from 'reapop';

export const Profile = () => {
  const [avatar, setAvatar] = useState<string>();
  const [login, setLogin] = useState<string>();
  const [file, setFile] = useState<any>();
  const [errors, setErrors] = useState();

  useEffect(() => {
    const fetchAvatar = async () => {
      await axios
        .get(
          `http://localhost:3001/app/users/profile/${sessionStorage.getItem(
            'currentUser',
          )}`,
        )
        .then((res) => {
          setAvatar(res.data.avatar);
        })
        .catch((err) => {
          console.error(err.response.data);
          notify('Welcome to the documentation', 'info');
          setErrors(err.response.data);
        });
    };

    if (!avatar) {
      fetchAvatar();
    }
  }, []);

  const base64FileURL = (e: File, cb: Function) => {
    let file = e;
    let reader = new FileReader();
    reader.onloadend = (e) => {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfile = async () => {
    const data = {
      id: Number.parseInt(sessionStorage.getItem('currentUser')),
      login: login,
    };
    await axios
      .post('http://localhost:3001/app/users/profile', data)
      .then((res) => {
        setErrors(null);
        setAvatar(res.data.avatar);
      })
      .catch((err) => {
        console.error(err.response.data);
        setErrors(err.response.data);
      });
  };

  const handleChange = async (event: any) => {
    const file = event.target.files?.[0];
    setFile(file);
    const formData = new FormData();
    formData.append('user', sessionStorage.getItem('currentUser'));
    formData.append('file', file);
    await axios
      .post('http://localhost:3001/app/users/avatar', formData)
      .then((res) => {
        base64FileURL(file, (obj) => {
          setAvatar(obj);
          handleProfile();
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrors(err.response.data);
      });
  };

  return (
    <Card shadow="sm" p="lg" radius="md" className='card' withBorder>
      <h1 className="card-title text-center">Profile</h1>
      <div className='card-profile'>
        <div className="profile-pic">
          <label className="-label" htmlFor="file">
            <AiFillEdit className='edit-icon-react'></AiFillEdit>
          </label>
          <input id="file" type="file" onChange={handleChange} />
          <img src={`data:image/jpeg;base64,${avatar}`} id="output" width="200" />
        </div>
        <div className="user-info">
          <h2>John Smith</h2>
          <p>Rank: 30th</p>
          <Progress size="lg" value={1}/> 
        </div>
      </div>

      <ul className="match-list">
        <li>
          <span className="team-name">Team A</span>
          <span className="team-score win">2</span>
          <span className="vs">vs</span>
          <span className="team-score lose">1</span>
          <span className="team-name">Team B</span>
        </li>
        <li>
          <span className="team-name">Team C</span>
          <span className="team-score lose">0</span>
          <span className="vs">vs</span>
          <span className="team-score win">3</span>
          <span className="team-name">Team D</span>
        </li>
      </ul>

      <DisplayErrors errors={errors} />

    </Card>
  );
};
