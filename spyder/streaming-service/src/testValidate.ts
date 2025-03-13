import { validateVehicleData } from "./validateData";

const testCases = [
  { battery_temperature: "45°C", timestamp: 1700000000000 }, // Valid string
  { battery_temperature: "4.5 °C", timestamp: 1700000000000 }, // Extra space
  { battery_temperature: "-10.2°C" }, // Negative value
  { battery_temperature: "not a number", timestamp: 1700000000000 }, // Invalid string
  { battery_temperature: 30, timestamp: 1700000000000 }, // Already a number
  { battery_temperature: "100F", timestamp: 1700000000000 }, // Wrong unit
  { battery_temperature: null, timestamp: 1700000000000 }, // Null value
  {}, // Empty object
];

testCases.forEach((test, index) => {
  console.log(`Test Case ${index + 1}:`, validateVehicleData(test));
});