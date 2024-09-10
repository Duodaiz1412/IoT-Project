import React, { useEffect, useState } from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from 'react-data-table-component';
import ActionHistoryData,  { useActionHistoryData } from "../data/ActionHistoryData";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

// Debounce function to delay calling the API
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function ActionHistory() {
  const data = useActionHistoryData();
  const [record, setRecord] = React.useState(data);
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [columns, setColumns] = useState(ActionHistoryData[0].column);

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce delay

  useEffect(() => {
    fetchData({
      searchTerm: debouncedSearchTerm,
      dateFilter,
      deviceFilter,
    })
  }, [debouncedSearchTerm, dateFilter, deviceFilter]);

  const fetchData = async (filters = {}) => {
    try {
      const response = await axios.get("http://localhost:8081/datasearch2", {
        params: filters,
      });
      setRecord(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value); // Search term will be debounced
  };

  const handleDeviceFilterChange = (e) => {
    setDeviceFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

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
          onChange={handleDeviceFilterChange}
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
            onChange={handleSearchTermChange} 
            placeholder="Tìm kiếm..." 
          />
        </div>
      </div>

      {/* Date Filter */}
      <input
          type="date"
          className="form-control me-3"
          style={{ maxWidth: "200px" }}
          onChange={handleDateFilterChange}
        />

      <DataTable 
        columns={columns}
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
