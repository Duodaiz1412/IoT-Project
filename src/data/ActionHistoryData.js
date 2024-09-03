import { useState, useEffect } from 'react';
import axios from 'axios';

const ActionHistoryData = [
  {
    column: [
      {
        name: 'ID',
        selector: row => row.id,
        sortable: true
      },
      {
        name: 'Thiết bị',
        selector: row => row.device,
        sortable: true
      },
      {
        name: 'Hành động',
        selector: row => row.action,
        sortable: true
      },
      {
        name: 'Thời gian',
        selector: row => row.date,
        sortable: true
      },
    ],
  },
  {
    data: []
  }
];

export const useActionHistoryData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:8081/data2');
        const actionData = result.data.map((item) => ({
          id: item.id,
          device: item.device,
          action: item.action,
          date: item.date
        }));
        setData(actionData);
        ActionHistoryData[1].data = actionData; // Update the exported constant
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    
  }, []);

  return data;
};

export default ActionHistoryData;