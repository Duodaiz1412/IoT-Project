import React, { useEffect, useState } from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from "react-data-table-component";

import {
  TiArrowSortedDown as SortDown,
  TiArrowSortedUp as SortUp,
  TiArrowUnsorted as UnSort,
} from "react-icons/ti";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

function ActionHistory() {
  const [record, setRecord] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [sort, setSort] = useState("desc");
  const [activeColumn, setActiveColumn] = useState(null); // Track the active column

  useEffect(() => {}, [activeColumn, sort]);

  useEffect(() => {
    fetchData({
      searchTerm,
      dateFilter,
      deviceFilter,
    });
  }, []);
  
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

  const handleSort = (column) => {
    const newSortOrder =
      sort === "desc" ? "asc" : sort === "asc" ? "desc" : "desc";
    setSort(newSortOrder);
    setActiveColumn(column); // Set the column as active

    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/sort_history",
          {
            params: {
              column,
              sort: newSortOrder, // Send sort order (asc, desc, or all)
            },
          }
        );
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
          Thiết bị
          <span onClick={() => handleSort("device")}>
            {sortIcon("device")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.device,
    },
    {
      name: (
        <>
          Hành động
          <span onClick={() => handleSort("action")}>
            {sortIcon("action")}
          </span>{" "}
        </>
      ),
      selector: (row) => row.action,
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

  const handleSearch = () => {
    fetchData({
      searchTerm: searchTerm,
      dateFilter,
      deviceFilter,
    });
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
        <button
          type="button"
          class="btn btn-outline-primary ms-3"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      {/* Date Filter */}
      <input
        type="date"
        className="form-control me-3"
        style={{ maxWidth: "200px" }}
        onChange={handleDateFilterChange}
      />

      <DataTable
        columns={columns} // Use dynamic columns here
        data={record}
        pagination
        fixedHeader
        highlightOnHover
      />
      <br />
    </>
  );
}

export default ActionHistory;
