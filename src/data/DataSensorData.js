import React, {useEffect, useState} from 'react'
import axios from 'axios';

const DataSensorData = [
    {
        column: [
            {
                name: 'id',
                selector: (row) => row.id,
                sortable: true
            },
            {
                name: 'Nhiệt độ',
                selector: row => row.temperature,
                sortable: true
            },
            {
                name: 'Độ ẩm',
                selector: row => row.humidity,
                sortable: true
            },
            {
                name: 'Ánh sáng',
                selector: row => row.lux,
                sortable: true
            },
            {
                name: 'Thời gian',
                selector: row => row.date,
                sortable: true
            },
        ]
    },
    {
        data: []
    }
]

export const useDataSensorData = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await axios.get('http://localhost:8081/data1');
          const dataSensor = result.data.map((item) => ({
            id: item.id,
            temperature: item.temperature,
            humidity: item.humidity,
            lux: item.lux,
            date: item.date,
          }));
          setData(dataSensor);
          DataSensorData[1].data = dataSensor; // Update the exported constant
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      fetchData();
    }, []);
  
    return data;
  };

export default DataSensorData