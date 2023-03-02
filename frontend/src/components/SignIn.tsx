import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayErrors } from './DisplayErrors';

export const SignIn = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();

  const navigate = useNavigate();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log();
    const formData = new FormData(event.currentTarget);
    const form = {
      login: formData.get('login'),
      password: formData.get('password'),
    };
    axios
      .post('http://localhost:3001/app/auth/signin', form, {
        headers: {},
      })
      .then((response) => {
        console.log('response = ', response);
        setErrors(null);
        document.cookie = response.data.cookie;
        console.log('token = ', response.data);
        sessionStorage.setItem('currentUser', response.data.user.id);
        navigate('/CoPage');
      })
      .catch((err) => {
        console.log(err.response.data); // Invalid credentials
        setErrors(err.response.data);
      });
  };

  return (
    <div className="flex-container">
      <div>
        <h1 className="text-center">SIGNIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="mc-menu">
            <input
              className="mc-button full"
              required
              type="text"
              name="login"
              placeholder="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className="mc-button full"
              required
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="mc-button full">SUBMIT</button>
          <div className="text-center">
            <DisplayErrors errors={errors} />
          </div>
        </form>
      </div>
    </div>
  );
};
