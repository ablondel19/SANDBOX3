import axios from 'axios';
import { useState } from 'react';
import { DisplayErrors } from './DisplayErrors';

export const Code2FA = () => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {
      code: formData.get('code'),
      login: localStorage.getItem('currentUser'),
    };
    axios
      .post('http://localhost:3001/app/auth/code', form, {
        headers: { Authorization: document.cookie },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.data);
      });
  };

  return (
    <div>
      <h1>2FA</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="code"
            placeholder="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">SUBMIT</button>
          <div className="text-center">
            <DisplayErrors errors={errors} />
          </div>
        </form>
      </div>
    </div>
  );
};