// src/app/interfaces/response.interface.ts

export interface IResponse {
    status: string; // ISO 8601 date string
    message: string;
    data: any;
}