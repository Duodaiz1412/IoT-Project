import React, { useEffect, useState } from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import DataSensorData from "../data/DataSensorData";

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

function DataSensor() {
  const [record, setRecord] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [parameterFilter, setParameterFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState(DataSensorData[0].column);

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce delay

  useEffect(() => {
    fetchData({
      searchTerm: debouncedSearchTerm,
      dateFilter,
      parameterFilter,
    });
  }, [debouncedSearchTerm, dateFilter, parameterFilter]);

  const fetchData = async (filters = {}) => {
    try {
      const response = await axios.get("http://localhost:8081/data3", {
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

  const handleParameterFilterChange = (e) => {
    setParameterFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <>
      <CHeader position="sticky" className="bg-white shadow-sm mb-4">
        <CContainer className="justify-content-center">
          <div className="mx-auto">
            <strong>Datasensor</strong>
          </div>
        </CContainer>
      </CHeader>

      <div className="mb-4 d-flex justify-content-center">
        <select
          className="form-select me-3"
          style={{ maxWidth: "150px" }}
          defaultValue="all"
          onChange={handleParameterFilterChange}
        >
          <option value="all">Tất cả thông số</option>
          <option value="nhiệt độ">Nhiệt độ</option>
          <option value="độ ẩm">Độ ẩm</option>
          <option value="ánh sáng">Ánh sáng</option>
        </select>

        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <CiSearch />
          </span>
          <input
            type="text"
            className="form-control"
            onChange={handleSearchTermChange} // Search will be debounced
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>

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
      <br />
    </>
  );
}

export default DataSensor;
