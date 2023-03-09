import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DisplayErrors } from './DisplayErrors';

export const SignUp = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {
      login: formData.get('login'),
      password: formData.get('password'),
      twoFactorEnabled: twoFactorEnabled,
      phoneNumber: twoFactorEnabled ? formData.get('tel') : undefined,
    };
    axios
      .post('http://localhost:3001/app/auth/signup', form)
      .then((res) => {
        sessionStorage.setItem('currentUser', res.data.id);
        document.cookie = res.data.Authorization;
        navigate('/SignIn');
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <div className="flex-container">
      <div>
        <h1 className="text-center">SIGNUP</h1>
        <form onSubmit={handleSubmit}>
          <div className="mc-menu">
            <input
              className="mc-button full"
              required
              type="text"
              name="login"
              maxLength={15}
              placeholder="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className="mc-button full"
              required
              type="password"
              name="password"
              maxLength={15}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {twoFactorEnabled && (
              <input
                className="mc-button full"
                type="tel"
                name="tel"
                maxLength={15}
                placeholder="2FA phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            )}
            <label>
              <input
                type="checkbox"
                name="twoFactor"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              />
              Enable 2 Factor Authentication
            </label>
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
