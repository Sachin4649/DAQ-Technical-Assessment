import net from "net";
import { WebSocket, WebSocketServer } from "ws";
import { validateVehicleData, VehicleData } from "./validateData";
import { monitorBatteryTemperature } from "./batteryMonitor";

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString().trim();
    console.log(`Received: ${message}`);

    try {
      const rawData = JSON.parse(message);
      const validData: VehicleData | null = validateVehicleData(rawData);

      if (validData) {
        // monitor temp violations
        monitorBatteryTemperature(validData.battery_temperature);
        
        // Send JSON over WebSocket to frontend clients
        websocketServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(validData));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error:", err);
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
