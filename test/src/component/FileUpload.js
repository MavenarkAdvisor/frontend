import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/cashflow', formData)
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error);
    });
};

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;