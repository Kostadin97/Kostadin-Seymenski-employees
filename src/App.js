import React, { useState } from 'react';

function App() {
  const [jsonData, setJsonData] = useState([]);

  const handleCSVInputChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = (e) => {
      const csvData = e.target.result;
      const lines = csvData.split("\n");
      const result = [];
      const finalData = [];

      lines.forEach((line) => {
        const finalLine = line.replace('\r', '').split(';');

        if (finalLine.includes("NULL")) {
          const formattedDate = new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).split('/').reverse().join('-');

          finalLine[finalLine.indexOf("NULL")] = formattedDate;
        }

        const fromDate = new Date(finalLine[2]);
        const toDate = new Date(finalLine[3]);
        const daysWorked = (toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24);

        finalLine[4] = daysWorked;

        const commonProject = result.find(x => x[1] === finalLine[1] && x[0] !== finalLine[0]);

        if (commonProject) {
          const totalDays = commonProject[4] + finalLine[4];
          const jsonResult = {
            employee1: finalLine[0],
            employee2: commonProject[0],
            projectId: finalLine[1],
            daysWorked: totalDays
          };

          finalData.push(jsonResult);
        }

        result.push(finalLine);
        setJsonData(finalData);
      });
    };

    reader.readAsText(file);
  };

  return (

    <div>
      <input type="file" accept=".csv" onChange={handleCSVInputChange} />
      {
        jsonData.length > 0 ? (
          <table style={{ marginTop: '50px' }}>
            <thead>
              <tr>
                <th>Employee #1</th>
                <th>Employee #1</th>
                <th>Project ID</th>
                <th>Days worked</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.map(item => {
                return (
                  <tr key={item.daysWorked}>
                    <td>{item.employee1}</td>
                    <td>{item.employee2}</td>
                    <td>{item.projectId}</td>
                    <td>{item.daysWorked}</td>
                    <td>{item.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Please select a CSV file.</p>
        )
      }

    </div>
  );
}

export default App;
