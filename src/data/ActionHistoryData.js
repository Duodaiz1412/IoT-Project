import React from 'react'

const ActionHistoryData = [
    {
        column: 
        [
            {
                name: 'id',
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
        data:
        [
            {
                id: 1,
                device: 'Đèn',
                action: 'Bật',
                date: '2024-08-01 12:00:00'
            },
            {
                id: 2,
                device: 'Đèn',
                action: 'Tắt',
                date: '2024-08-01 12:01:00'
            },
            {
                id: 3,
                device: 'Điều hoà',
                action: 'Bật',
                date: '2024-08-01 12:02:00'
            },
            {
                id: 4,
                device: 'Quạt',
                action: 'Bật',
                date: '2024-08-01 12:03:00'
            },
            {
                id: 5,
                device: 'Điều hoà',
                action: 'Tắt',
                date: '2024-08-01 12:04:00'
            },
            {
                id: 6,
                device: 'Quạt',
                action: 'Tắt',
                date: '2024-08-01 12:05:00'
            },
            {
                id: 7,
                device: 'Đèn',
                action: 'Bật',
                date: '2024-08-01 12:06:00'
            },
            {
                id: 8,
                device: 'Đèn',
                action: 'Tắt',
                date: '2024-08-01 12:07:00'
            },
            {
                id: 9,
                device: 'Quạt',
                action: 'Bật',
                date: '2024-08-02 12:08:00'
            },
            {
                id: 10,
                device: 'Quạt',
                action: 'Tắt',
                date: '2024-08-02 12:30:00'
            },
        ]
    }
]

export default ActionHistoryData