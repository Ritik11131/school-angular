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
      // {
      //   field: 'imm',
      //   header: 'Immobilizer',
      //   displayType: 'chip',
      // },
      { field: 'extVolt', header: 'Battery Voltage', },
      { field: 'deviceTime', header: 'Last Update',  displayType:'date' },

    ],
    // toolbar: {
    //   showNew: true,
    //   showDelete: true,
    //   showImport: true,
    //   showExport: true
    // },
    paginator: true,
    globalFilter: true,
    selectionMode: 'single',
    minWidth:'55rem',
    showCurrentPageReport: true,
    rowHover: true,
    responsive: true
  };