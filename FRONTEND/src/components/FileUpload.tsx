import React, { useState, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(undefined);
  const [res, setRes] = useState<any>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const base64FileURL = (e, cb) => {
    let file = e;
    let reader = new FileReader();
    reader.onloadend = function (e) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('user', sessionStorage.getItem('currentUser'));
    formData.append('file', file);
    await axios
      .post('http://localhost:3001/app/auth/data', formData)
      .then((res) => {
        base64FileURL(file, (obj) => {
          setRes(obj);
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" name="file" onChange={handleChange} />
      <button type="submit">Upload</button>
      <img
        className="avatar"
        src={res}
        alt="avatar"
        style={{ height: '5%', width: '5%' }}
      />
    </form>
  );
};

export default FileUpload;
