import { cn } from "@/lib/utils" // Importing utility for conditional class names

interface TemperatureProps {
  temp: any;
}

/**
 * Numeric component that displays the temperature value.
 * 
 * @param {number} props.temp - The temperature value to be displayed.
 * @returns {JSX.Element} The rendered Numeric component.
 */
function Numeric({ temp }: TemperatureProps) {
  // TODO: Change the color of the text based on the temperature
  // HINT:
  //  - Consider using cn() from the utils folder for conditional tailwind styling
  //  - (or) Use the div's style prop to change the colour
  //  - (or) other solution

  // Justify your choice of implementation in brainstorming.md

  const getTemperatureColor = (temp: number): string => {
    if (temp < 20 || temp > 80) return "text-red-500"; // Unsafe
    if (temp <= 25 || temp >= 75) return "text-yellow-500"; // Nearing unsafe
    return "text-green-500"; // Safe
  };

  return (
    <div className={cn("text-foreground text-4xl font-bold", getTemperatureColor(temp))}>
      {`${temp}°C`}
    </div>
  );
}

export default Numeric;
