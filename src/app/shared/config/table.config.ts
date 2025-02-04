import { TableConfig } from "@/app/shared/interfaces/table.interface";

export const dashboardTableConfig: TableConfig = {
    columns: [
      { field: 'vehicleNo', header: 'Vehice No', },
      { field: 'deviceId', header: 'Imei', },
      {
        field: 'ign',
        header: 'Ignition',
        
        displayType: 'chip',
      },
      { field: 'extVolt', header: 'Battery Voltage', },
      { field: 'deviceTime', header: 'Last Update',  displayType:'date' },

    ],
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'55rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };

  export const crewTableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'Crew Name', },
      { field: 'role', header: 'Role', displayType: 'chip' },
      { field: 'licenseNumber', header: 'License Number', },
      { field: 'contactNumber', header: 'Contact Number', },
    ],
    toolbar: {
      showNew: true,
    },
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'75rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };


  export const parentTableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'Parent Name', },
      { field: 'email', header: 'Email', },
      { field: 'contactNumber', header: 'Contact Number', },
      { field: 'emergencyContact', header: 'Emergency Number', },
      { field: 'smsEnabled', header: 'Sms', displayType: 'icon'},
      { field: 'pushEnabled', header: 'Push', displayType: 'icon'},
      { field: 'isActive', header: 'Status', displayType: 'chip' },
    ],
    toolbar: {
      showNew: true,
      showExport: true,
      customButtons: [
        {
          id: 1,
          key: 'download_sample_file',
          label: 'Download Sample', // Clear and specific
          tooltip: 'Download a sample file', // Provides context
          icon: 'pi pi-cloud-download',
          severity: 'contrast'
        },
        {
          id: 2,
          key: 'upload_sample_file',
          label: 'Upload Sample', // Consistent with the download action
          tooltip: 'Upload a sample file', // Explains purpose
          icon: 'pi pi-cloud-upload',
          severity: 'contrast'
        }
      ]
    },
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'75rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };

  export const routeTableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'Route Name', },
      { field: 'type', header: 'Type', },
      { field: 'description', header: 'Description', },
      { field: 'distanceM', header: 'Distance (m)', },
      { field: 'startTime', header: 'Start Time', },
      { field: 'endTime', header: 'End Time', },
      { field: 'startCoordinates', header: 'Start Coordinates', },
      { field: 'endCoordinates', header: 'End Coordinates', },
    ],
    toolbar: {
      showNew: true,
    },
    actions: {
      customButtons: [
        {
          id: 1,
          key: 'view',
          tooltip: 'View Route',
          icon: 'pi pi-eye',
          severity: 'contrast'
        },
      ]
    },
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'75rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };


  export const plansTableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'Crew Name', },
      { field: 'role', header: 'Role', displayType: 'chip' },
      { field: 'licenseNumber', header: 'License Number', },
      { field: 'contactNumber', header: 'Contact Number', },
    ],
    toolbar: {
      showNew: true,
    },
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'75rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };