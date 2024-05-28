// import React from "react";
// import FileUpload from "./component/FileUpload";

// function App() {
//   return (
//     <div className="App">
//       <FileUpload/>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import axios from "axios";

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [settlementDate, setsettlementDate] = useState(null);
  const [error, setError] = useState("");

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("settlement_date", settlementDate);

    try {
      const response = await axios.post(
        "http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/subsecinfo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      setData(response.data);

      await axios.get(response.data.downloadUrl);
      setError("");
    } catch (err) {
      setError("Failed to upload file.");
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name=""
          id=""
          onChange={(e) => setsettlementDate(e.target.value)}
        />
        <input type="file" onChange={handleFile1Change} accept=".xlsx, .xls" />
        <input type="file" onChange={handleFile2Change} accept=".xlsx, .xls" />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <h3>File Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
