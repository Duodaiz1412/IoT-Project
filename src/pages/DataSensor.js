import React from "react";
import { CHeader, CContainer } from "@coreui/react";
import DataTable from 'react-data-table-component'

import DataSensorData from "../data/DataSensorData"; 

function DataSensor() {
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

      <DataTable 
        columns={DataSensorData[0].column}
        data={DataSensorData[1].data}
        pagination
        fixedHeader
      />
    </>
  );
}

export default DataSensor;
