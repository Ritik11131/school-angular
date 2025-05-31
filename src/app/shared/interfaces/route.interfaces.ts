export interface IRoute {
    id: number;
    name: string;
    type: "UP" | "DOWN"; // Union type for fixed values
    description: string;
    distanceM: number;
    startTime: string; // Keep as string unless you plan to handle Date conversion globally
    endTime: string;
    startCoordinates: [number, number]; // Tuple for latitude and longitude
    endCoordinates: [number, number];
    color?: string; // Optional for table data
    active?: boolean; // Optional for table data
    createdAt?: string; // Optional for route fetch data
    updatedAt?: string; // Optional for route fetch data
    defaultBusId?: number | null; // Optional for route fetch data
    lastBusId?: number | null; // Optional for route fetch data
    schoolId?: number; // Optional for route fetch data
    defaultDriverId?: number; // Optional for route fetch data
    defaultHelperId?: number | null; // Optional for route fetch data
    defaultTeacherId?: number | null; // Optional for route fetch data
    geojson?: {
      type: string;
      features: {
        type: string;
        geometry: {
          type: string;
          coordinates: number[] | number[][];
        };
        properties: {
          name?: string;
          description?: string | null;
          waitDurationS?: number;
        };
      }[];
    }; // Optional for route fetch data
  }


  export interface IMutateRoute {
    id?: any; // Optional for create operation
    routeName:string;
    routeDirection: string; // Union type for fixed values
    geojson: string;
    attribute: string;
  }
  
  