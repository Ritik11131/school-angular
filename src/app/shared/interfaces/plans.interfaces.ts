export interface IPlan {
    id:number;
    name: string;
    description: string;
    price: number;
    currency: string;
    days: number;
}

export interface IMutatePlan {
    name: string;
    description: string;
    price: number;
    currency: string;
    days: number;
}