import React, { useEffect } from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from 'react-data-table-component';
import ActionHistoryData,  { useActionHistoryData } from "../data/ActionHistoryData";
import { CiSearch } from "react-icons/ci";

function ActionHistory() {
  const data = useActionHistoryData();
  const [record, setRecord] = React.useState(data);
  const [deviceFilter, setDeviceFilter] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  console.log(data)
  console.log(record)

  useEffect(() => {
    setRecord(data);
  }, [data]);


  function handleFilter(e) {
    const value = e.target.value.toLowerCase();
    const filteredData = data.filter((row) => {
      const matchesDevice = deviceFilter ? row.device.toLowerCase().includes(deviceFilter) : true;
      const matchesSearch =
        row.id.toString().includes(value) ||
        row.device.toLowerCase().includes(value) ||
        row.action.toLowerCase().includes(value) ||
        row.date.toString().includes(value);

      return matchesDevice && matchesSearch;
    });
    setRecord(filteredData);
  }

  function handleDeviceFilter(e) {
    const selectedDevice = e.target.value.toLowerCase();
    setDeviceFilter(selectedDevice);

    const filteredData = data.filter((row) => {
      const matchesDevice = selectedDevice ? row.device.toLowerCase().includes(selectedDevice) : true;
      return matchesDevice;
    });
    setRecord(filteredData);
  }

  function handleDateFilter(e) {
    const selectedDate = e.target.value;
    setDateFilter(selectedDate);

    const filteredData = data.filter((row) => {
      const matchesDevice = deviceFilter ? row.device.toLowerCase().includes(deviceFilter) : true;
      const matchesDate = selectedDate ? row.date.startsWith(selectedDate) : true;
      return matchesDevice && matchesDate;
    });
    setRecord(filteredData);
  }

  return (
    <>
      {/* Header */}
      <CHeader position="sticky" className="bg-white shadow-sm mb-4">
        <CContainer className="justify-content-center">
          <div className="mx-auto">
            <strong>Action History</strong>
          </div>
        </CContainer>
      </CHeader>

      <div className="mb-4 d-flex justify-content-center">
        {/* Device Filter */}
        <select
          className="form-select me-3"
          style={{ maxWidth: "150px" }}
          onChange={handleDeviceFilter}
          defaultValue=""
        >
          <option value="">Tất cả thiết bị</option>
          <option value="đèn">Đèn</option>
          <option value="điều hoà">Điều hoà</option>
          <option value="quạt">Quạt</option>
        </select>

        {/* Search Input */}
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <CiSearch />
          </span>
          <input 
            type="text" 
            className="form-control" 
            onChange={handleFilter} 
            placeholder="Tìm kiếm..." 
          />
        </div>
      </div>

      {/* Date Filter */}
      <input
          type="date"
          className="form-control me-3"
          style={{ maxWidth: "200px" }}
          onChange={handleDateFilter}
        />

      <DataTable 
        columns={ActionHistoryData[0].column}
        data={record}
        pagination
        fixedHeader
        highlightOnHover
      />
      <br/>
    </>
  );
}

export default ActionHistory;
