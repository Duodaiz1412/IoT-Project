const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const swagger = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");


const app = express();
const PORT = 8081;
const client = mqtt.connect("mqtt://172.20.10.2");

const MQTT_TOPIC = "iot_project";
const MQTT_REQUEST = "iot_project_request";
const MQTT_UPDATE = "iot_project_update";

let dataSensor = []
let actionHistory = []

// Allow cross-origin requests from the frontend app
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iot_project",
  port: "3307",
});

// Format time from Date() to "YY:MM:DD hh:mm:ss"
function getFormattedTime() {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;
}

client.on("connect", () => {
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === MQTT_TOPIC) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.error("Failed to parse MQTT message as JSON:", error);
      return;
    }

    if (data.temperature !== undefined)
      data.temperature = parseFloat(data.temperature.toFixed(1));
    if (data.humidity !== undefined)
      data.humidity = parseFloat(data.humidity.toFixed(1));
    if (data.lux !== undefined) data.lux = parseFloat(data.lux.toFixed(1));

    data.date = getFormattedTime();

    const sql =
      "INSERT INTO data_sensor (temperature, humidity, lux, date, fan, light, ac) VALUES (?)";
    const values = [
      data.temperature,
      data.humidity,
      data.lux,
      data.date,
      data.fan,
      data.light,
      data.ac,
    ];

    db.query(sql, [values], (err) => {
      if (err) {
        console.error("Error inserting data into database:", err);
      } else {
        // console.log("Data inserted into database:", data);
      }
    });
  }
});

// Get status data from ESP32
app.get("/status", (req, res) => {
  db.query(
    "SELECT fan, light, ac, temperature, humidity, lux FROM data_sensor ORDER BY id DESC LIMIT 7;",
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Error executing SQL query" });
      }

      const data = result.map((row) => {
        return {
          fan: row.fan,
          light: row.light,
          ac: row.ac,
          temperature: row.temperature,
          humidity: row.humidity,
          lux: row.lux,
        };
      });

      return res.json(data);
    }
  );
});

// Get data from the database for data sensor
app.get("/data1", (req, res) => {
  const sql = "SELECT * FROM data_sensor ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Error executing SQL query" });
    }

    const data = result.map((row) => {
      const dateObj = new Date(row.date);
      const formattedDate = `${dateObj.getUTCFullYear()}-${String(
        dateObj.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(
        2,
        "0"
      )} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(
        dateObj.getUTCMinutes()
      ).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;

      return {
        id: row.id,
        temperature: row.temperature,
        humidity: row.humidity,
        lux: row.lux,
        date: formattedDate,
      };
    });

    return res.json(data);
  });
});

// Get data from the database for action history
app.get("/data2", (req, res) => {
  const sql = "SELECT * FROM action_history ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Error executing SQL query" });
    }

    const data = result.map((row) => {
      const dateObj = new Date(row.date);
      const formattedDate = `${dateObj.getUTCFullYear()}-${String(
        dateObj.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(
        2,
        "0"
      )} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(
        dateObj.getUTCMinutes()
      ).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;

      return {
        id: row.id,
        device: row.device,
        action: row.action,
        date: formattedDate,
      };
    });

    return res.json(data);
  });
});

app.post("/actiondata", async (req, res) => {
  const { device, action } = req.body;

  try {
    await new Promise((resolve, reject) => {
      client.subscribe(MQTT_UPDATE, (err) => {
        if (err) {
          console.error("Failed to subscribe to MQTT topic:", err);
          return reject(new Error("Failed to subscribe to MQTT topic"));
        }
        resolve();
      });
    });

    client.publish(MQTT_REQUEST, JSON.stringify({ device, action }), (err) => {
      if (err) {
        console.error("Failed to send data to MQTT Broker:", err);
        return res
          .status(500)
          .json({ error: "Failed to send action data to MQTT" });
      }
      console.log(
        "Action data sent to MQTT:",
        JSON.stringify({ device, action })
      );
    });

    const timeout = setTimeout(() => {
      console.error("Timeout waiting for MQTT response");
      client.unsubscribe(MQTT_UPDATE);
      client.removeListener("message", handleMessage);
      return res
        .status(500)
        .json({ error: "Timeout waiting for MQTT response" });
    }, 10000); // 10 seconds timeout

    const handleMessage = (topic, message) => {
      if (topic === MQTT_UPDATE) {
        clearTimeout(timeout);
        client.unsubscribe(MQTT_UPDATE);
        client.removeListener("message", handleMessage);

        try {
          const data = JSON.parse(message);
          const { device: responseDevice, action: responseAction } = data;
          if (responseDevice === device && responseAction === action) {
            const dev =
              device === "light"
                ? "Đèn"
                : device === "fan"
                ? "Quạt"
                : "Điều hoà";
            const act = action === "on" ? "Bật" : "Tắt";
            const sql =
              "INSERT INTO action_history (device, action, date) VALUES (?)";
            const values = [dev, act, getFormattedTime()];

            db.query(sql, [values], (err) => {
              if (err) {
                console.error(
                  "Error inserting action history into database:",
                  err
                );
              } else {
                console.log("Action history inserted into database:", {
                  dev,
                  act,
                });
              }
            });
            return res.json({ device: responseDevice, action: responseAction });
          }
        } catch (error) {
          console.error("Failed to parse MQTT response:", error);
          return res
            .status(500)
            .json({ error: "Failed to parse MQTT response" });
        }
      }
    };

    client.on("message", handleMessage);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/datasearch1", (req, res) => {
  const {
    parameterFilter,
    dateFilter,
    searchTerm
  } = req.query; 
  console.log(req.query);

  let query = "SELECT * FROM data_sensor";
  if(searchTerm && searchTerm !== 'undefined'){
    if (parameterFilter)
      query += " WHERE ";
    if (parameterFilter) {
      if(parameterFilter === "temp") query += `ROUND(temperature, 1) = ${searchTerm} `;
      if(parameterFilter === "humidity") query += `humidity = ${searchTerm} `;
      if(parameterFilter === "lux") query += `ROUND(lux, 1) = ${searchTerm} `;
    } else{
      query += ` WHERE (ROUND(temperature, 1) = ${searchTerm} OR humidity = ${searchTerm} OR ROUND(lux, 1) = ${searchTerm})`;
    }
  }
  
  if (dateFilter && searchTerm === 'undefined' || !searchTerm && dateFilter)
    query += ` WHERE date >= '${dateFilter} 00:00:00' AND date <= '${dateFilter} 23:59:59'`;
  else if(dateFilter && searchTerm){
    query += ` AND date >= '${dateFilter} 00:00:00' AND date <= '${dateFilter} 23:59:59'`;
  }

  query += " ORDER BY ID DESC ";
  // if (pageSize) query += `LIMIT ${pageSize} `;
  // if (currentPage) query += `OFFSET ${(currentPage - 1) * pageSize}`;
  console.log(query);
  // query db ;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Error executing SQL query" });
    }

    const data = result.map((row) => {
      const dateObj = new Date(row.date + 'Z');
      const formattedDate = `${dateObj.getUTCFullYear()}-${String(
        dateObj.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(
        2,
        "0"
      )} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(
        dateObj.getUTCMinutes()
      ).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;

      return {
        id: row.id,
        temperature: row.temperature,
        humidity: row.humidity,
        lux: row.lux,
        date: formattedDate,
      };
    });
    dataSensor = data;
    return res.json(data)
  });
});

app.get("/datasearch2", (req, res) => {
  const {
    deviceFilter,
    dateFilter,
    searchTerm
  } = req.query; 
  console.log(req.query);

  let query = "SELECT * FROM action_history";
  if(searchTerm && searchTerm !== 'undefined'){
    if (deviceFilter)
      query += " WHERE ";
    if (deviceFilter) {
      if(deviceFilter === "đèn") query += `device = "Đèn" `;
      if(deviceFilter === "điều hoà") query += `device = "Điều hoà" `;
      if(deviceFilter === "quạt") query += `device = "Quạt" `;
      query += `AND action = '${searchTerm}' `;
    } else {
      query += ` WHERE (device = '${searchTerm}' OR action = '${searchTerm}') `;
    }
  } else if(!searchTerm && deviceFilter){
      query += " WHERE ";
      if(deviceFilter === "đèn") query += `device = "Đèn" `;
      if(deviceFilter === "điều hoà") query += `device = "Điều hoà" `;
      if(deviceFilter === "quạt") query += `device = "Quạt" `;
  }

  if ((dateFilter && searchTerm === 'undefined' && !deviceFilter) || (!searchTerm && dateFilter && !deviceFilter) )
    query += ` WHERE Date >= '${dateFilter} 00:00:00' AND Date <= '${dateFilter} 23:59:59'`;
  else if((dateFilter && searchTerm) || (dateFilter && deviceFilter)){
    query += ` AND Date >= '${dateFilter} 00:00:00' AND Date <= '${dateFilter} 23:59:59'`;
  }
  query += " ORDER BY ID DESC ";
  // if (pageSize) query += `LIMIT ${pageSize} `;
  // if (currentPage) query += `OFFSET ${(currentPage - 1) * pageSize}`;
  console.log(query);
  // query db ;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Error executing SQL query" });
    }

    const data = result.map((row) => {
      const dateObj = new Date(row.date + 'Z');
      const formattedDate = `${dateObj.getUTCFullYear()}-${String(
        dateObj.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getUTCDate()).padStart(
        2,
        "0"
      )} ${String(dateObj.getUTCHours()).padStart(2, "0")}:${String(
        dateObj.getUTCMinutes()
      ).padStart(2, "0")}:${String(dateObj.getUTCSeconds()).padStart(2, "0")}`;

      return {
        id: row.id,
        device: row.device,
        action: row.action,
        date: formattedDate,
      };
    });
    actionHistory = data;
    return res.json(data)
  });
});

app.get("/sort_sensor", (req, res) => {
  const { column, sort } = req.query;
  console.log(req.query);
  if (!dataSensor.length) {
    res.status(400).json({ error: "No data to sort" });
  }

  const sortedData = dataSensor.sort((a, b) => {
    if (sort === "asc") {
      return a[column] > b[column] ? 1 : -1;
    } else {
      return a[column] < b[column] ? 1 : -1;
    }
  });
  res.json(sortedData);
});

app.get("/sort_history", (req, res) => {
  const { column, sort } = req.query;
  console.log(req.query);
  if (!actionHistory.length) {
    res.status(400).json({ error: "No data to sort" });
  }

  const sortedData = actionHistory.sort((a, b) => {
    if (sort === "asc") {
      return a[column] > b[column] ? 1 : -1;
    } else {
      return a[column] < b[column] ? 1 : -1;
    }
  });
  res.json(sortedData);
});

// const option = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "IOT Project API",
//       version: "1.0.0", 
//       description: "An API for IOT Project",
//     },
//     servers: [
//       {
//         url: "http://localhost:8081 ",
//       },
//     ],
//   },
//   apis: ["../src/pages/*.js"],
// };
const swaggerDocument = YAML.load('./apidocs.yaml');
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
