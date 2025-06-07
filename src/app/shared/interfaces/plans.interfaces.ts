export interface IPlan {
    id:number;
    planName: string;
    planRate: number;
    gatewayFees: number;
    gstRate: number;
}

export interface IMutatePlan {
    id?: any; // Optional for create operation
    planName: string;
    planRate: number;
    gatewayFees: number;
    gstRate: number;
    attribute?: string; // Optional attribute for additional data, stored as JSON string
}