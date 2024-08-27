import React from 'react'

const DataSensorData = [
    {
        column: [
            {
                name: 'id',
                selector: row => row.id,
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
                selector: row => row.time,
                sortable: true
            }
        ]
    },
    {
        data: [
            {
                id: 1,
                temperature: 30,
                humidity: 50,
                lux: 1000,
                time: '2021-08-01 12:00:00'
            },
            {
                id: 2,
                temperature: 31,
                humidity: 51,
                lux: 1100,
                time: '2021-08-01 12:01:00'
            },
            {
                id: 3,
                temperature: 32,
                humidity: 52,
                lux: 1200,
                time: '2021-08-01 12:02:00'
            },
            {
                id: 4,
                temperature: 33,
                humidity: 53,
                lux: 1300,
                time: '2021-08-01 12:03:00'
            },
            {
                id: 5,
                temperature: 34,
                humidity: 54,
                lux: 1400,
                time: '2021-08-01 12:04:00'
            },
            {
                id: 6,
                temperature: 35,
                humidity: 55,
                lux: 1500,
                time: '2021-08-01 12:05:00'
            },
            {
                id: 7,
                temperature: 36,
                humidity: 56,
                lux: 1600,
                time: '2021-08-01 12:06:00'
            },
            {
                id: 8,
                temperature: 37,
                humidity: 57,
                lux: 1700,
                time: '2021-08-01 12:07:00'
            },
            {
                id: 9,
                temperature: 38,
                humidity: 58,
                lux: 1800,
                time: '2021-08-01 12:08:00'
            },
            {
                id: 10,
                temperature: 39,
                humidity: 59,
                lux: 1900,
                time: '2021-08-01 12:09:00'
            },
            {
                id: 11,
                temperature: 40,
                humidity: 60,
                lux: 2000,
                time: '2021-08-01 12:10:00'
            },
            {
                id: 12,
                temperature: 41,
                humidity: 61,
                lux: 2100,
                time: '2021-08-01 12:11:00'
            },
            {
                id: 13,
                temperature: 42,
                humidity: 62,
                lux: 2200,
                time: '2021-08-01 12:12:00'
            },
            {
                id: 14,
                temperature: 43,
                humidity: 63,
                lux: 2300,
                time: '2021-08-01 12:13:00'
            },
            {
                id: 15,
                temperature: 44,
                humidity: 64,
                lux: 2400,
                time: '2021-08-01 12:14:00'
            },
            {
                id: 16,
                temperature: 45,
                humidity: 65,
                lux: 2500,
                time: '2021-08-01 12:15:00'
            },
            {
                id: 17,
                temperature: 46,
                humidity: 66,
                lux: 2600,
                time: '2021-08-01 12:16:00'
            }
        ]
    }
]

export default DataSensorData