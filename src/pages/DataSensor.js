import React from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from 'react-data-table-component'
import { CiSearch } from "react-icons/ci";
import DataSensorData from "../data/DataSensorData"; 

function DataSensor() {
  const data = DataSensorData[1].data;
  const [record, setRecord] = React.useState(data);
  const [dateFilter, setDateFilter] = React.useState("");

  function handleFilter(e) {
    const value = data.filter((row) =>{
      return row.temperature.toString().includes(e.target.value) || row.humidity.toString().includes(e.target.value) || row.lux.toString().includes(e.target.value) || row.time.toString().includes(e.target.value)
    })
    setRecord(value)
  }

  function handleDateFilter(e) {
    const value = e.target.value;
    setDateFilter(value);
    const filteredData = data.filter((row) => {
      const matchesDate = value ? row.date.startsWith(value) : true;
      return matchesDate;
    });
    setRecord(filteredData);
  }

  return (
    <>
      {/* Header */}
      <CHeader position="sticky" className="bg-white shadow-sm mb-4">
        <CContainer className="justify-content-center">
          <div className="mx-auto">
            <strong>Datasensor</strong>
          </div>
        </CContainer>
      </CHeader>

      {/* Body */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text">
            <CiSearch />
          </span>
          <input 
            type='text' 
            className="form-control" 
            onChange={handleFilter} 
            placeholder="Tìm kiếm..." 
          />
        </div>
      </div>

      <input
          type="date"
          className="form-control me-3"
          style={{ maxWidth: "200px" }}
          onChange={handleDateFilter}
        />

      <DataTable 
        columns={DataSensorData[0].column}
        data={record}
        pagination
        fixedHeader
        highlightOnHover
      />
      <br/>
    </>
  );
}

export default DataSensor;
