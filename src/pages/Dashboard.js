import React, { useState, useEffect } from "react";
import WidgetDropDown from "../views/WidgetDropDown";
import {
  CContainer,
  CRow,
  CCol,
  CCardBody,
  CCard,
  CHeader,
  CButton,
} from "@coreui/react";
import axios from "axios";

import { FaFan, FaLightbulb, FaWind } from "react-icons/fa";
import { Line } from "react-chartjs-2";

function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [fanStatus, setFanStatus] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);
  const [acStatus, setAcStatus] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/status");
      console.log(res.data);
      setFanStatus(res.data[0].fan === 1);
      setLightStatus(res.data[0].light === 1);
      setAcStatus(res.data[0].ac === 1);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
  }, []);

  const [loading, setLoading] = useState({
    fan: false,
    light: false,
    ac: false,
  });

  const handleAction = async (device, action) => {
    setLoading((prev) => ({ ...prev, [device]: true }));
    const actionData = {
      device: device,
      action: action,
    };
    try {
      const res = await axios.post('http://localhost:8081/actiondata', actionData);
      console.log(res.data.action);
      console.log(res.data.device);
      if (res.data.action === "on") {
        if (device === "fan") setFanStatus(true);
        if (device === "light") setLightStatus(true);
        if (device === "ac") setAcStatus(true);
      } else if (res.data.action === "off") {
        if (device === "fan") setFanStatus(false);
        if (device === "light") setLightStatus(false);
        if (device === "ac") setAcStatus(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [device]: false }));
    }
  };

  return (
    <>
      {/* Header */}
      <CHeader position="sticky" className="bg-white shadow-sm mb-4">
        <CContainer className="justify-content-center">
          <div className="mx-auto">
            <strong>Dashboard</strong>
          </div>
        </CContainer>
      </CHeader>

      {/* Body */}
      <WidgetDropDown className="mb-4" />
      <CCardBody>
        <CRow>
          <CCol xs={8}>
            <Line
              className="rounded border border-green bg-white"
              data={{
                labels: ["", "", "", "", "", ""],
                datasets: [
                  {
                    type: "bar",
                    label: "Nhiệt độ",
                    data: [29, 30, 31, 32, 29, 28],
                    fill: true,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    yAxisID: "y", 
                  },
                  {
                    type: "bar",
                    label: "Độ ẩm",
                    data: [50, 51, 52, 53, 50, 49],
                    fill: true,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    yAxisID: "y", 
                  },
                  {
                    yAxisID: "y1",
                    label: "Ánh sáng",
                    data: [
                      1000, 1100, 1200, 1300, 1100, 800
                    ],
                    borderColor: "#FF6A6A",
                    fill: false,
                    
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: "Biểu đồ 6 giá trị đo gần nhất",
                    font: {
                      size: 20,
                    },
                  },
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                layout: {
                  padding: 9,
                },
              }}
            />
          </CCol>
          <CCol xs={4} className="d-flex flex-column">
            {/* Fan */}
            <CCard
              className="rounded border border-gray mb-3 d-flex align-items-center justify-content-center"
              style={{
                height: "8rem",
                padding: 0,
                backgroundColor: isHovered ? "#18b418" : "#25f025",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CButton
                onClick={() => !loading.fan && handleAction("fan", fanStatus ? "off" : "on")}
                color={fanStatus ? "" : "secondary"}
                className={
                  "w-100 h-100 position-relative d-flex align-items-center justify-content-center "
                }
                style={{ fontSize: "1.5rem" }}
              >
                <FaFan
                  className={`position-absolute start-0 ms-3 ${
                    fanStatus ? "spinning-fan" : ""
                  }`}
                />
                <span>{loading.fan ? "Loading..." : fanStatus ? "Fan: On" : "Fan: Off"}</span>
              </CButton>
            </CCard>

            {/* Light */}
            <CCard
              className="rounded border border-gray mb-3 d-flex align-items-center justify-content-center"
              style={{ height: "8rem", padding: 0 }}
            >
              <CButton
                onClick={() => !loading.light && handleAction("light", lightStatus ? "off" : "on")}
                color={lightStatus ? "warning" : "secondary"}
                className="w-100 h-100 position-relative d-flex align-items-center justify-content-center"
                style={{ fontSize: "1.5rem" }}
              >
                <FaLightbulb
                  className={`position-absolute start-0 ms-3 ${
                    lightStatus ? "shining-light" : ""
                  }`}
                />
                <span>{loading.light ? "Loading..." : lightStatus ? "Light: On" : "Light: Off"}</span>
              </CButton>
            </CCard>

            {/* AC */}
            <CCard
              className="rounded border border-gray mb-3 d-flex align-items-center justify-content-center"
              style={{ height: "8rem", padding: 0 }}
            >
              <CButton
                onClick={() => !loading.ac && handleAction("ac", acStatus ? "off" : "on")}
                color={acStatus ? "info" : "secondary"}
                className="w-100 h-100 position-relative d-flex align-items-center justify-content-center"
                style={{ fontSize: "1.5rem" }}
              >
                <FaWind
                  className={`position-absolute start-0 ms-3 ${
                    acStatus ? "blowing-air" : ""
                  }`}
                />
                <span>{loading.ac ? "Loading..." : acStatus ? "AC: On" : "AC: Off"}</span>
              </CButton>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </>
  );
}

export default Dashboard;
