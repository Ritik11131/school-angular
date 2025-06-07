export interface IStudent {
    id: number;
    school: {
        id: number;
        userName: string;
    };
    integrationId: string;
    studentName: string;
    class: string;
    section: string;
    registeredDate: string;
    parentCount: number;
    pickupRoute: {
        id: number;
        routeName: string;
    };
    dropRoute: {
        id: number;
        routeName: string;
    };
    pickupStop: {
        id: number;
        stopName: string;
    };
    dropStop: {
        id: number;
        stopName: string;
    };
    plan: {
        id: number;
        planName: string;
    };
    creationTime: string;
    lastUpdateOn: string;

}

export interface IMutateStudent {
    id?: any; // Optional for create operation
    integrationId: string;
    studentName: string;
    class: string;
    section: string;
    registeredDate: string; // ISO date string, e.g., "2025-05-12"
    fkPickupRoute: number;
    fkDropRoute: number;
    fkPickupStopId: number;
    FkDropStopId: number;
    fkPlanId: number;
    attribute: string; // Stored as JSON string, parse to object if needed
}