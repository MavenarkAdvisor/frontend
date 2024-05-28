// import React, { useState } from 'react';
// import axios from 'axios';
// import { Workbook } from 'exceljs';
// import FileSaver from 'file-saver';

// const DataDownloadButton = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleClick = async () => {
//     setIsLoading(true);

//     try {
//       const response = await axios.get('/api/download-data'); // Replace with your API endpoint
//       const data = response.data;

//       const workbook = new Workbook();
//       const worksheet = workbook.addWorksheet('My Data');

//       // Process data for Excel (assuming array of objects)
//       const headers = Object.keys(data[0]); // Extract headers from first object
//       worksheet.addRow(headers);
//       data.forEach(row => worksheet.addRow(Object.values(row))); // Add data rows

//       const blob = await workbook.xlsx.writeBuffer();
//       const fileName = 'data.xlsx';
//       FileSaver.saveAs(blob, fileName);
//     } catch (error) {
//       console.error('Error fetching or processing data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <button onClick={handleClick} disabled={isLoading}>
//       {isLoading ? 'Downloading...' : 'Download Data'}
//     </button>
//   );
// };

// export default DataDownloadButton;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // For Excel file creation
import * as FileSaver from 'file-saver'; // For file download

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileName = 'cashflow.xlsx';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('', {
          responseType: 'blob' // Important for binary data handling
        });

        const formattedData = await response.data.arrayBuffer(); // Convert to ArrayBuffer
        const workbook = XLSX.read(formattedData, { type: 'array' }); // Parse Excel data

        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert to JSON

        setData(sheetData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = () => {
    if (data.length === 0) {
      alert('No data to export. Please fetch data first');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, fileName);
  };

  return (
    <div>
      {isLoading && <p>Fetching data...</p>}
      {error && <p>Error: {error}</p>}
      {data.length > 0 && (
        <button onClick={handleDownload}>Download as Excel</button>
      )}
    </div>
  );
};

export default App;
