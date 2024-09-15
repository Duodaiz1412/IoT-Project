import React, { useEffect, useState } from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import DataSensorData from "../data/DataSensorData";

import {
  TiArrowSortedDown as SortDown,
  TiArrowSortedUp as SortUp,
  TiArrowUnsorted as UnSort,
} from "react-icons/ti";

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
  const [sort, setSort] = useState("desc");
  const [activeColumn, setActiveColumn] = useState(null); // Track the active column

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce delay

  useEffect(() => {}, [activeColumn, sort]);

  const handleSort = (column) => {
    const newSortOrder =
        sort === "desc" ? "asc" : sort === "asc" ? "desc" : "desc";
    setSort(newSortOrder);
    setActiveColumn(column); // Set the column as active

    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:8081/sort1", {
          params: {
            column,
            parameterFilter,
            sort: newSortOrder, // Send sort order (asc, desc, or all)
          },
        });
        setRecord(response.data); // Update data with sorted results
      } catch (error) {
        console.error("Error fetching sorted data:", error);
      }
    };

    fetch(); // Fetch sorted data from backend
  };

  const sortIcon = (column) => {
    // Show the correct icon only for the active column
    if (activeColumn === column) {
      if (sort === "asc")
        return <SortUp style={{ fontSize: "1rem", cursor: "pointer" }} />;
      if (sort === "desc")
        return <SortDown style={{ fontSize: "1rem", cursor: "pointer" }} />;
    }
    // Default icon for columns that aren't currently sorted
    return <UnSort style={{ fontSize: "1rem", cursor: "pointer" }} />;
  };

  const columns = [
    {
      name: (
        <>
          ID
          <span onClick={() => handleSort("id")}>{sortIcon("id")}</span>{" "}
        </>
      ),
      selector: (row) => row.id,
    },
    {
      name: (
        <>
          Nhiệt độ
          <span onClick={() => handleSort("temperature")}>
            {sortIcon("temperature")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.temperature,
    },
    {
      name: (
        <>
          Độ ẩm
          <span onClick={() => handleSort("humidity")}>
            {sortIcon("humidity")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.humidity,
    },
    {
      name: (
        <>
          Ánh sáng
          <span onClick={() => handleSort("lux")}>
            {sortIcon("lux")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.lux,
    },
    {
      name: (
        <>
          Thời gian
          <span onClick={() => handleSort("date")}>
            {sortIcon("date")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.date,
    },
  ];

  useEffect(() => {
    fetchData({
      searchTerm: debouncedSearchTerm,
      dateFilter,
      parameterFilter,
    });
  }, [debouncedSearchTerm, dateFilter, parameterFilter]);

  const fetchData = async (filters = {}) => {
    try {
      const response = await axios.get("http://localhost:8081/datasearch1", {
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
          style={{ maxWidth: "160px" }}
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
