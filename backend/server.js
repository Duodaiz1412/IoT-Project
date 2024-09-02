import express from 'express';

const app = require("express")
const PORT = 8081;

const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://172.20.10.2")

const MQTT_TOPIC = "iot_project"

// Allow cross-origin requests from the frontend app
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

// Format time from Date() to "YY:MM:DD hh:mm:ss"
function getFormattedTime() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

client.on("connect", () => {
    client.subscribe(MQTT_TOPIC, (err) => {
        if(err){
            console.log(err)
        }
    });
});

client.on("message", (topic, message) => {
    const data = JSON.parse(message)
    
    // Round the data
    data.humidity = parseFloat(data.humidity.toFixed(1))
    data.temperature = parseFloat(data.temperature.toFixed(1))
    data.lux = parseFloat(data.lux.toFixed(1))
    
    // Add current date to JSON
    data.date = getFormattedTime()
    console.log(JSON.stringify(data))
})
