import { RouteService } from '@/app/core/services/route.service';
import { UiService } from '@/app/core/services/ui.service';
import { GenericTableComponent } from '@/app/shared/components/generic-table/generic-table.component';
import { routeTableConfig } from '@/app/shared/config/table.config';
import { IRoute } from '@/app/shared/interfaces/route.interfaces';
import { TableConfig } from '@/app/shared/interfaces/table.interface';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, Map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-route',
  imports: [GenericTableComponent, LeafletModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent {
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

  constructor(private routeService: RouteService, private uiService: UiService) { }


  ngOnInit(): void {
    this.loadRouteService();
  }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
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

  handleConfigActionClicked(event: any) {
    console.log('Config Action Clicked:', event);
    const action = event.action;
    switch (action) {
      case 'view':
        this.selectedRoute = event.item;
        this.uiService.openDrawer(this.viewRouteContent, 'Route Management');
        break;
      default:
        break;
    }
  }

}
