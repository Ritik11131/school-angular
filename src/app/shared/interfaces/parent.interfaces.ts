export interface IParent {
    id: number; // Assuming id is a number
    name: string;
    // email: string;
    registeredMobileNo: string;
    attribute?: string; // Optional attribute for additional data
}

export interface IMutateParent {
    name: string;
    // username: string;
    // email: string;
    registeredMobileNo: string;
    attribute?: string; // Optional attribute for additional data
  }