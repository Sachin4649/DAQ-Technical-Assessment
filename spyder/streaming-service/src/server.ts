import net from "net";
import { WebSocket, WebSocketServer } from "ws";
import { validateVehicleData } from "./validateData";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

let violationHistory: { timestamp: number }[] = []; // Stores timestamps of out-of-range readings

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();
    const parsedData = JSON.parse(message);

    const validData = validateVehicleData(parsedData);

    if (validData) {
      // Check if battery temperature is out of range
      if (validData.battery_temperature < 20 || validData.battery_temperature > 80) {
        const currentTime = Date.now();

        // Remove entries older than 5 seconds
        violationHistory = violationHistory.filter((entry) => currentTime - entry.timestamp <= 5000);

        // Add the new violation
        violationHistory.push({ timestamp: currentTime });

        // If 3+ violations within 5 seconds, log error
        if (violationHistory.length >= 3) {
          console.error(`[ALERT] Battery temperature exceeded safe range 3+ times in 5s! Timestamp: ${new Date(currentTime).toISOString()}`);
        }
      }

      // Send valid data to frontend
      websocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(validData));
        }
      });
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`WebSocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend WebSocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
