import { useState } from "react";
import axios from "axios";

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [settlementDate, setsettlementDate] = useState(null);
  const [from, setfrom] = useState(null);
  const [to, setto] = useState(null);
  const [error, seterror] = useState("");

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleDownload = async () => {
    if (!from) {
      return alert("Please select from date");
    } else if (!to) {
      return alert("Please select to Date");
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/download",
        { from, to },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx");
      document.body.appendChild(link);
      link.click();

      alert("Result file download successfully");
    } catch (err) {
      alert("No Data fetched in date range");
    }
  };

  const handleSubmit = async () => {
    if (!file1) {
      return alert("Please Upload File 1");
    } else if (!file2) {
      return alert("Please Upload File 2");
    } else if (!settlementDate) {
      return alert("Please select settlement date");
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("settlement_date", settlementDate);

    try {
      const response = await axios.post(
        "http://localhost:8080/subsecinfo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx");
      document.body.appendChild(link);
      link.click();

      // setData(response.data);

      alert("Result file download successfully");
    } catch (err) {
      alert("Failed to upload file.");
    }
  };

  const handleUpload = async () => {
    if (!file1) {
      return alert("Please Upload File 1");
    } else if (!file2) {
      return alert("Please Upload File 2");
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status) {
        alert("Files Upload Successfully");
      }
    } catch (err) {
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 gap-6">
      <h2 className="text-2xl">Upload Excel File</h2>

      <div className="w-1/2 flex flex-col gap-8 bg-slate-900 p-8 rounded-lg">
        <div className="flex justify-between ">
          <div className="flex flex-col gap-4 items-center">
            <input
              type="file"
              className="hidden"
              id="file1"
              onChange={handleFile1Change}
              accept=".xlsx, .xls"
            />
            <div>{file1?.name ? file1.name : "No File Selected"}</div>

            <label
              htmlFor="file1"
              className="bg-slate-100 text-black p-2 font-bold rounded-md"
            >
              Upload File 1
            </label>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <input
              type="file"
              className="hidden"
              id="file2"
              onChange={handleFile2Change}
              accept=".xlsx, .xls"
            />

            <div>{file2?.name ? file2.name : "No File Selected"}</div>

            <label
              className="bg-slate-100 text-black p-2 font-bold rounded-md"
              htmlFor="file2"
            >
              Upload File 2
            </label>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            className="bg-lime-300 p-2 px-4 text-black font-bold rounded-lg"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
        {error && (
          <p className="text-center" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>

      <div className="w-1/2 flex flex-col justify-around items-center gap-8 bg-slate-900 p-8 rounded-lg">
        <div className="text-xl ">Submit Data for Calculation</div>
        <div className="flex items-center justify-around w-full">
          <div className="flex flex-col gap-2 items-center">
            <label htmlFor="settlementdate">Settlement Date</label>
            <input
              type="date"
              name=""
              id="settlementdate"
              className="p-2 px-4 border-white border-2 rounded-md"
              onChange={(e) => setsettlementDate(e.target.value)}
            />
          </div>
          <button
            className="h-fit bg-orange-400 p-2 px-6 text-black font-bold rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-around items-center gap-8 bg-slate-900 p-8 rounded-lg">
        <div className="text-xl">Download Data</div>

        <div className="flex justify-around w-full">
          <div className="flex flex-col gap-2 items-center">
            <label htmlFor="from">From</label>
            <input
              type="date"
              name=""
              id="from"
              className="p-2 px-4 border-white border-2 rounded-md"
              onChange={(e) => setfrom(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <label htmlFor="to">To</label>
            <input
              type="date"
              name=""
              id="to"
              className="p-2 px-4 border-white border-2 rounded-md"
              onChange={(e) => setto(e.target.value)}
            />
          </div>
        </div>

        <button
          className="h-fit bg-orange-400 p-2 px-6 text-black font-bold rounded-md"
          onClick={handleDownload}
        >
          Dowmload
        </button>
      </div>
      {/* {data && (
        <div>
          <h3>File Data:</h3>
          <pre>{JSON.stringify(data.calculatedData, null, 2)}</pre>
          <table>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th style={{ padding: "1rem" }} key={i}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.result.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, i) => (
                    <td key={i}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                {columns1.map((col, i) => (
                  <th style={{ padding: "1rem" }} key={i}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.Redemption_Schedule.map((row, i) => (
                <tr key={i}>
                  {columns1.map((col, i) => (
                    <td key={i}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default App;
