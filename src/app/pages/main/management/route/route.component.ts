import { RouteService } from '@/app/core/services/route.service';
import { UiService } from '@/app/core/services/ui.service';
import { FormData, FormField, GenericFormComponent } from '@/app/shared/components/generic-form/generic-form.component';
import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import { routeTableConfig } from '@/app/shared/config/table.config';
import { NEW_ROUTE_FORM_JSON } from '@/app/shared/constants/route';
import { IMutateRoute, IRoute } from '@/app/shared/interfaces/route.interfaces';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { latLng, Map, tileLayer } from 'leaflet';
import { RouteCreatorComponent } from "../../../../shared/components/route-creator/route-creator.component";

@Component({
  selector: 'app-route',
  imports: [GenericTableComponent, GenericFormComponent, LeafletModule, RouteCreatorComponent],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent {
  @ViewChild("createRouteContent") createRouteContent!: TemplateRef<any>;
  @ViewChild("viewRouteContent") viewRouteContent!: TemplateRef<any>;

  map!: Map;
  loading:boolean = false;
  tableConfig: TableConfig = routeTableConfig;
  tableData: IRoute[] = [];
  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Open Street',
        maxZoom: 18,
      })
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
  };
  selectedRoute: IRoute | null = null;
  routeFormFields = signal<FormField[]>(NEW_ROUTE_FORM_JSON);
  currentCreatedRouteObject!: { geoJson: any, routeData: any };
  

  constructor(private routeService: RouteService, private uiService: UiService) { }


  ngOnInit(): void {
    this.loadRouteService();
  }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
      // If you have a selected route, add its GeoJSON layer
      if (this.selectedRoute?.geojson) {
        this.addGeoJsonLayer(this.selectedRoute.geojson);
      }
    }, 200);
  }

  private addGeoJsonLayer(geoJson: any): void {
    const geoJsonLayer = L.geoJSON(geoJson, {
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      },
      pointToLayer: (feature, latlng) => {
      

      // Create a custom icon
      const customIcon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'marker-icon.png', // Ensure the path is correct
        shadowUrl: 'marker-shadow.png', // Ensure the path is correct
       
      });

      return L.marker(latlng, { icon: customIcon });
      },
      style: (feature) => {
        return {
          color: '#ff7800',
          weight: 5,
          opacity: 0.65
        };
      }
    }).addTo(this.map);

    // Fit the map to the bounds of the GeoJSON layer
    this.map.fitBounds(geoJsonLayer.getBounds());
  }


  async loadRouteService() {
    await this.operateRouteList();
  }


  async operateRouteList() {
    this.loading = true;
    try {
      const data: IRoute[] = await this.routeService.getRoutesList();
      this.tableData = data;
      this.loading = false;
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to fetch parent list');
      this.loading = false;
    }
  }

  async operateRouteWithId(id: number) {
    this.loading = true;
    try {
      const data: IRoute = await this.routeService.getRouteById(id);
      this.selectedRoute = data;
      this.uiService.openDrawer(this.viewRouteContent, 'Route Management');
      this.loading = false;
    } catch (error) {
      this.uiService.showToast('error', 'Error', 'Failed to fetch route');
      this.loading = false;
    }
  }

  async handleConfigActionClicked(event: any) {
    console.log('Config Action Clicked:', event);
    const {action, item} = event;
    switch (action) {
      case 'view':
        await this.operateRouteWithId(item.id);
        this.uiService.openDrawer(this.viewRouteContent, 'Route Management');
        break;
      default:
        break;
    }
  }

  async handleNewRoute() {
    this.uiService.openDrawer(this.createRouteContent, 'Create Route', '!w-[98vw] rounded-l-2xl');
  }

  async handleFormSubmit(formData: FormData): Promise<void> {
    console.log('Form submitted:', formData);
    this.loading = true;
    const routeObj: IMutateRoute = {
      routeName: formData['routeName'],
      routeDirection: formData['routeDirection'], // Assuming this is a string like "UP" or "DOWN"
      geojson: JSON.stringify(this.currentCreatedRouteObject?.geoJson || {}), // Assuming this is the GeoJSON object
      attribute: JSON.stringify(this.currentCreatedRouteObject?.routeData || {}) // Assuming you want to send an empty attribute object
      
    }
    try {
      const response = await this.routeService.createRoute(routeObj);
      console.log(response);
      this.uiService.closeDrawer();
      this.uiService.showToast('success', 'Success', 'Route created successfully');
      await this.operateRouteList();
    } catch (error: any) {
      console.log(error);
      this.uiService.showToast('error', 'Error', 'Failed to create route');
    } finally {
      this.loading = false;
    }
    
  }

  async handleRouteCreated(route: any): Promise<void> {
  console.log('Received GeoJSON:', route);
  this.currentCreatedRouteObject = route;
}

}
