import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import { dashboardTableConfig } from '@/app/shared/config/table.config';
import { statusCards } from '@/app/shared/constants/dashboard';
import { IstatusCards } from '@/app/shared/interfaces/dashboard.interfaces';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { icon, latLng, marker, polyline, tileLayer, point, Map, markerClusterGroup, MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import { DashboardService } from '@/app/core/services/dashboard.service';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, AvatarModule, CommonModule, LeafletModule, GenericTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  map!: Map;
  markerClusters!: MarkerClusterGroup;
  
  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; Open Street',
          maxZoom: 18,
      })
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
  };
  loading: boolean = false;
  tableConfig: TableConfig = dashboardTableConfig;
  statusCards: IstatusCards[] = statusCards;
  tableData: any[] = [];
  activeOnes:string = '';


  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {}

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      this.markerClusters = markerClusterGroup();
      this.map.invalidateSize();
      this.loadDashboardService();
    }, 100);
  }

  plotMarkers = (response: any[]) => {  
    this.map.removeLayer(this.markerClusters);
    this.markerClusters.clearLayers();
      
    response.forEach(item => {
      const { latitude, longitude } = item.position;
      const status = item.position.status.status;
  
      // Define marker colors based on status
      let markerColor = 'gray'; // Default color
      switch (status) {
        case 'Customer recharge expired':
          markerColor = 'red';
          break;
        case 'Running':
          markerColor = 'green';
          break;
        case 'stop':
          markerColor = 'red';
          break;
        case 'Offline':
          markerColor = 'grey';
            break;
        case 'dormant':
          markerColor = 'blue';
          break;
        default:
          markerColor = 'gray';
      }
  
      if (latitude && longitude) {
        // Create a marker
        const Marker = marker([latitude, longitude], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'marker-icon.png',
            shadowUrl: 'marker-shadow.png',
            className: `marker-${markerColor}` // Add a class for custom styling
          })
        });
  
        // Add a tooltip to the marker
        Marker.bindTooltip(
          `Vehicle No: <b>${item.device.vehicleNo}</b><br>Status: ${status}<br>Last Update: ${item.position.deviceTime}`,
          { permanent: false }
        );
  
        // Add the marker to the cluster group
        this.markerClusters.addLayer(Marker);
      }
    });
  
    // Add the marker cluster group to the map
    this.map.addLayer(this.markerClusters);
  
    // Optionally fit the map bounds to the markers
    if (response.length > 0) {
      const bounds = this.markerClusters.getBounds();      
      this.map.fitBounds(bounds, {
        maxZoom: 10,
      });
    }
  };

  createTableData = (response: any[]) => {
    let ignTrueCount = 0; // Counter for `ign` values that are true
  
    const tableData = response.map(item => {
      const ignValue = item.position.details.ign;
      if (ignValue) {
        ignTrueCount++;
      }
  
      return {
        vehicleNo: item.device.vehicleNo,
        deviceId: item.device.deviceId,
        deviceTime: item.position.deviceTime,
        ign: ignValue,
        imm: item.position.details.armed,
        extVolt: item.position.details.extVolt
      };
    });
  
    return { tableData, ignTrueCount };
  };
  

  updateStatusCards = (data: any[], statusCards: IstatusCards[]): IstatusCards[] => {
    // Reset counts to zero for all cards
    statusCards.forEach(card => (card.count = 0));

    // Iterate through response and update status card counts
    data.forEach(({ position }) => {
      const status = position.status.status; // E.g., "Customer recharge expired"
      switch (status) {
        case 'Customer recharge expired':
          statusCards.find(card => card.status === 'Offline')!.count++;
          break;
        case 'running':
          statusCards.find(card => card.status === 'Running')!.count++;
          break;
        case 'stop':
          statusCards.find(card => card.status === 'Stopped')!.count++;
          break;
        case 'Offline':
          statusCards.find(card => card.status === 'Offline')!.count++;
          break;
        case 'Never Connected':
          statusCards.find(card => card.status === 'Never Connected')!.count++;
          break;
        case 'dormant':
          statusCards.find(card => card.status === 'Idle')!.count++;
      }
    });

    // Update the Total card with the sum of all other card counts
    const totalCount = statusCards
      .filter(card => card.status !== 'Total')
      .reduce((sum, card) => sum + card.count, 0);
    statusCards.find(card => card.status === 'Total')!.count = totalCount;

    return statusCards;
  };


  async loadDashboardService() {
    this.loading = true;
    try {
      const response: IResponse = await this.dashboardService.fetchVehicleList();
      console.log(response);

      // Update Status Cards
      this.statusCards = this.updateStatusCards(response?.data, statusCards);

      // Create Table Data
      const {tableData,ignTrueCount } = this.createTableData(response?.data);
      this.tableData = tableData;
      this.activeOnes = `${ignTrueCount} Vehicles with IgnitionOn`;
      
      // Plot Markers
      this.plotMarkers(response?.data);

      this.loading = false;

    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }


}
