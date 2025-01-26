export interface ICrew {
    id: number; // Assuming id is a number
    isPilot: boolean;
    isHelper: boolean;
    isTeacher: boolean;
    licenseNumber: string;
    emergencyContact: string;
    name: string;
    email: string;
    contactNumber: string;
}

export interface IMutateCrew {
    name: string;
    email: string;
    username: string;
    contactNumber: string;
    address: string;
    isPilot: boolean;
    isHelper: boolean;
    isTeacher: boolean;
    attributes: {
      emergencyContact: string;
      licenseNumber: string;
    };
  }