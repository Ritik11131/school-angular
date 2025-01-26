export interface IRoute {
    id: number;
    name: string;
    type: "UP" | "DOWN"; // Use a union type if there are fixed values
    description: string;
    distanceM: number;
    startTime: string; // Use a Date object if you plan to convert and handle times
    endTime: string;
    startCoordinates: string; // Use a tuple if you want to separate latitude and longitude
    endCoordinates: string;
  }
  