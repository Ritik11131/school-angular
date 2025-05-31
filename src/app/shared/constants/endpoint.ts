// Authentication Endpoints
export const LOGIN_ENDPOINT = 'LivetrackVts/Parent/Login';
export const REFRESH_ENDPOINT = 'oauth/token/refresh';


// Dashboard Endpoints
export const GET_VEHICLE_LIST_ENDPOINT = 'dashboard/vehicles/list';

// Crew Endpoints
export const GET_CREW_LIST_ENDPOINT = 'crew/list';
export const CREATE_CREW_ENDPOINT = 'crew/create';

// Parent Endpoints
export const GET_PARENT_LIST_ENDPOINT = 'LivetrackVts/Parent/List';
export const CREATE_PARENT_ENDPOINT = 'LivetrackVts/Parent/create';
export const GET_PARENT_BY_ID_ENDPOINT = 'LivetrackVts/Parent/GetById';
export const UPDATE_PARENT_ENDPOINT = 'LivetrackVts/Parent/update';
export const SAMPLE_FILE_ENDPOINT = 'storage/static/parent_bulk_upload.xlsx';
export const SAMPLE_FILENAME = 'parent_bulk_upload.xlsx';
export const UPLOAD_PARENT_BULK_ENDPOINT = 'bulk/parents/create';

// Route Endpoints
export const GET_ROUTE_LIST_ENDPOINT = 'LivetrackVts/Route/List';
export const CREATE_ROUTE_ENDPOINT = 'LivetrackVts/Route/create';
export const GET_ROUTE_BY_ID_ENDPOINT = 'LivetrackVts/Route/GetById';

// Plan Endpoints
export const GET_PLAN_LIST_ENDPOINT = 'plans/list';
export const CREATE_PLAN_ENDPOINT = 'plans/create'