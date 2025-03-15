// validateData.ts
export interface VehicleData {
    battery_temperature: number;
    timestamp: number;
  }
  
  /**
   * Validates incoming vehicle data.
   * Ensures battery_temperature is a valid number and provides a fallback timestamp.
   */
  export function validateVehicleData(data: any): VehicleData | null {
    if (
      typeof data?.battery_temperature === "number" &&
      !isNaN(data.battery_temperature)
    ) {
      return {
        battery_temperature: parseFloat(data.battery_temperature.toFixed(3)), // Ensure 3 decimal places
        timestamp: data.timestamp || Date.now(),
      };
    } else {
      console.warn("Invalid data received:", data);
      return null; // Return null for invalid data
    }
  }
  