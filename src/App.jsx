import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [systemDate, setSystemDate] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const downloadXLSX = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "PriceMaster.xlsx");
  };

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleFile3Change = (e) => {
    setFile3(e.target.files[0]);
  };

  const handleDownload = async () => {
    if (!from) {
      return alert("Please select from date");
    } else if (!to) {
      return alert("Please select to Date");
    }

    try {
      const { data } = await axios.post("http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/download", {
        from,
        to,
      });

      if (data.status) {
        downloadXLSX(data.data);

        // alert("Result file downloaded successfully");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleSubmit = async () => {
    if (!file1) {
      return alert("Please Upload File 1");
    } else if (!file2) {
      return alert("Please Upload File 2");
    } else if (!file3) {
      return alert("Please Upload File 2");
    } else if (!systemDate) {
      return alert("Please select settlement date");
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("file3", file3);
    formData.append("system_date", systemDate);

    try {
      const { data } = await axios.post(
        "http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/subsecinfo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.status) {
        downloadXLSX(data.data);

        alert("Result file downloaded successfully");
      }
    } catch (err) {
      console.log(err);
      alert("Something bad happened");
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
        "http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status) {
        alert("Files uploaded successfully");
      }
    } catch (err) {
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4 gap-4 bg-slate-100">
      {/* Upload cashflow security details and stock master */}
      <h2 className="text-2xl text-black font-bold">Upload Excel File</h2>
      <div className="flex gap-6 w-full">
        <div className="w-1/2 flex flex-col gap-4 bg-slate-900 p-4 rounded-lg justify-around items-center">
          <div className="flex justify-between gap-6">
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
                Upload Cashflow File
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
                Upload Security Details File
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
        </div>
        <div className="w-1/2 flex flex-col gap-4 bg-slate-900 p-4 rounded-lg justify-around items-center">
          <div className="justify-between ">
            <div className="flex flex-col gap-4 items-center">
              <input
                type="file"
                className="hidden"
                id="file3"
                onChange={handleFile3Change}
                accept=".xlsx, .xls"
              />
              <div>{file3?.name ? file3.name : "No File Selected"}</div>
              <label
                htmlFor="file3"
                className="bg-slate-100 text-black p-2 font-bold rounded-md"
              >
                Upload StockMasterV1 File
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
        </div>
      </div>
      {/* System Date and Data download using date range*/}
      <div className="flex flex-row gap-6 w-full">
        <div className="w-1/2 flex flex-col justify-around items-center gap-4 bg-slate-900 p-4 rounded-lg">
          <div className="text-xl ">Submit System Date for Calculation</div>
          <div className="flex items-center justify-around w-full">
            <div className="flex flex-col gap-2 items-center">
              <input
                type="date"
                name=""
                id="systemdate"
                className="p-2 px-4 border-white border-2 rounded-md text-black font-bold"
                onChange={(e) => setSystemDate(e.target.value)}
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
        <div className="w-1/2 flex flex-col justify-around items-center gap-4 bg-slate-900 p-4 rounded-lg">
          <div className="text-xl">Download Data</div>

          <div className="flex justify-around w-full gap-6">
            <div className="flex flex-col gap-2 items-center">
              <label htmlFor="from">From</label>
              <input
                type="date"
                name=""
                id="from"
                className="p-2 px-4 border-white border-2 rounded-md text-black font-bold"
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <label htmlFor="to">To</label>
              <input
                type="date"
                name=""
                id="to"
                className="p-2 px-4 border-white border-2 rounded-md text-black font-bold"
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          <button
            className="h-fit bg-orange-400 p-2 px-6 text-black font-bold rounded-md"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
