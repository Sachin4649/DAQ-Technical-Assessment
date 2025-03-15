// batteryMonitor.ts

let violationHistory: { timestamp: number }[] = [];

// Define safe temperature range
const MIN_SAFE_TEMP = 20;
const MAX_SAFE_TEMP = 80;
const TIME_WINDOW = 5000; // 5 seconds
const MAX_VIOLATIONS = 4;

/**
 * Monitors battery temperature and logs an alert if out-of-range values exceed 3 times within 5 seconds.
 */
export function monitorBatteryTemperature(temperature: number) {
  const currentTime = Date.now();

  // Check if temperature is outside safe range
  if (temperature < MIN_SAFE_TEMP || temperature > MAX_SAFE_TEMP) {
    console.warn(`Battery temperature out of safe range: ${temperature}°C`);

    // Since the violationHistory is an array of the timestamps of the violations, so it checks the timestamps of all the elements in the array with the most recent
    // violation time to see if it was within 5 seconds. 
    violationHistory = violationHistory.filter(
      (entry) => currentTime - entry.timestamp <= TIME_WINDOW
    );

    // Add new violation timestamp
    violationHistory.push({ timestamp: currentTime });

    // Trigger alert if more than MAX_VIOLATIONS in the time window
    if (violationHistory.length > MAX_VIOLATIONS) {
      console.error(
        `[ALERT] Battery temperature exceeded safe range ${MAX_VIOLATIONS}+ times in ${TIME_WINDOW / 1000}s! Timestamp: ${new Date(
          currentTime
        ).toISOString()}`
      );
    }
  }
}