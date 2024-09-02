import { React, useState } from "react";
import { CRow, CCol, CWidgetStatsA } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";

import { FaTemperatureEmpty } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import { CiBrightnessDown } from "react-icons/ci";

import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import Chart3 from "./Chart3";

const getTemperatureColor = (temperature) => {
    // Clamp the temperature value between 0 and 50 for the sake of simplicity
    const clampedTemp = Math.max(0, Math.min(temperature, 50))
  
    // Calculate the linear interpolation between yellow (255, 255, 0) and red (255, 0, 0)
    const greenComponent = Math.round(255 - (clampedTemp / 50) * 255)
  
    // Return the RGB color string
    return `rgb(255, ${greenComponent}, 0)`
  }

  const getHumidityColor = (humidity) => {
    const clampedHumi = Math.max(0, Math.min(humidity, 100));
  
    // Calculate the red, green, and blue components based on humidity
    const redComponent = Math.round(173 - (clampedHumi / 100) * (173 - 20)); // from 173 to 20
    const greenComponent = Math.round(216 - (clampedHumi / 100) * 216); // from 216 to 0
    const blueComponent = Math.round(230 + (clampedHumi / 100) * (255 - 230)); // from 230 to 255
  
    // Return the RGB color string with the calculated components
    return `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;
  };

  const getLuxColor = (lux) => {
    const clampedLux = Math.max(100, Math.min(lux, 700));

    // Calculate the red and green components based on lux
    const redComponent = Math.round(204 - (clampedLux - 100) / 600 * (204 - 153)); // from 204 to 153
    const greenComponent = Math.round(153 + (clampedLux - 100) / 600 * (255 - 153)); // from 153 to 255
    const blueComponent = 0; // Keep blue component constant to achieve yellow shades

    // Return the RGB color string with the calculated components
    return `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;
};

  
const WidgetDropDown = (props) => {

  const [temp, setTemp] = useState(24);
  const [humidity, setHumidity] = useState(0);
  const [lux, setLux] = useState(500);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol>
        <CWidgetStatsA
          style={{
            backgroundColor: getTemperatureColor(temp), 
            color: "#fff", 
          }}
          value={
            <>
              {temp} <span className="fs-8">°C</span>
            </>
          }
          action={
            <FaTemperatureEmpty className="temp" onClick={() => setTemp(temp + 5)} />
            // <button className="btn btn-outline-black mr-0" onClick={() => setTemp(temp + 1)}>+</button>
          }
          title="Nhiệt độ"
          chart={
            <Chart1 />
          }
        />
      </CCol>
      <CCol>
        <CWidgetStatsA
          style={{
            backgroundColor: getHumidityColor(humidity), // Set dynamic background color
            color: "#fff", // Ensure text is visible on darker backgrounds
          }}
          // className="custom-widget"
          value={
            <>
              {humidity} <span className="fs-8">%</span>
            </>
          }
          title="Độ ẩm"
          action={
            <WiHumidity className="humi" onClick={() => setHumidity(humidity + 5)}>+</WiHumidity>
          }
          chart={
            <Chart2/>
          }
        />
      </CCol>
      <CCol>
        <CWidgetStatsA
          style={{
            backgroundColor: getLuxColor(lux),
            color: "#fff", 
          }}
          value={
            <>
              {lux} <span className="fs-8">LUX</span>
            </>
          }
          title="Độ sáng"
          action={
            <CiBrightnessDown className="lux" onClick={() => setLux(lux + 50)}>+</CiBrightnessDown>
          }
          chart={
            <Chart3/>
          }
        />
      </CCol>
    </CRow>
  );
};

export default WidgetDropDown;
