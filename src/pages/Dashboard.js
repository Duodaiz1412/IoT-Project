import React, { useState } from "react";
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

import { FaFan, FaLightbulb, FaWind } from "react-icons/fa";
import { Line } from "react-chartjs-2";

function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [fanStatus, setFanStatus] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);
  const [acStatus, setAcStatus] = useState(false);

  const toggleFan = () => setFanStatus(!fanStatus);
  const toggleLight = () => setLightStatus(!lightStatus);
  const toggleAc = () => setAcStatus(!acStatus);

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
                onClick={toggleFan}
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
                <span>{fanStatus ? "Fan: On" : "Fan: Off"}</span>
              </CButton>
            </CCard>

            {/* Light */}
            <CCard
              className="rounded border border-gray mb-3 d-flex align-items-center justify-content-center"
              style={{ height: "8rem", padding: 0 }}
            >
              <CButton
                onClick={toggleLight}
                color={lightStatus ? "warning" : "secondary"}
                className="w-100 h-100 position-relative d-flex align-items-center justify-content-center"
                style={{ fontSize: "1.5rem" }}
              >
                <FaLightbulb
                  className={`position-absolute start-0 ms-3 ${
                    lightStatus ? "shining-light" : ""
                  }`}
                />
                <span>{lightStatus ? "Light: On" : "Light: Off"}</span>
              </CButton>
            </CCard>

            {/* AC */}
            <CCard
              className="rounded border border-gray mb-3 d-flex align-items-center justify-content-center"
              style={{ height: "8rem", padding: 0 }}
            >
              <CButton
                onClick={toggleAc}
                color={acStatus ? "info" : "secondary"}
                className="w-100 h-100 position-relative d-flex align-items-center justify-content-center"
                style={{ fontSize: "1.5rem" }}
              >
                <FaWind
                  className={`position-absolute start-0 ms-3 ${
                    acStatus ? "blowing-air" : ""
                  }`}
                />
                <span>{acStatus ? "AC: On" : "AC: Off"}</span>
              </CButton>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </>
  );
}

export default Dashboard;
