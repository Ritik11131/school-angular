import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessageService, ConfirmationService } from 'primeng/api';

declare var H: any;

interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  marker?: any;
}

interface RouteData {
  stops: RouteStop[];
  routeGeometry?: any;
  totalDistance?: number;
  totalDuration?: number;
  geoJson?: any;
}

@Component({
  selector: 'app-route-creator',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule, 
    ToastModule, 
    InputTextModule,
    InputNumberModule,
    CardModule,
    DividerModule,
    ConfirmDialogModule,
    DialogModule,
    PanelModule,
    ScrollPanelModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
  <div class="p-4 h-screen overflow-hidden">
    <p-confirmDialog></p-confirmDialog>

    <div class="grid gap-4 lg:grid-cols-12">
      <!-- Left Panel -->
      <div class="lg:col-span-4 w-full h-full">
        <p-card header="Route Creator">
          <div class="h-[calc(100vh-200px)] overflow-y-auto space-y-4">
            
            <!-- Add Stop Section -->
            <p-panel header="Add New Stop" [collapsed]="false">
              <div class="space-y-4">
                <div>
                  <label for="stopName" class="font-semibold text-gray-600 block mb-1">Stop Name</label>
                  <input 
                    pInputText 
                    id="stopName" 
                    [(ngModel)]="newStop.name" 
                    placeholder="Enter stop name"
                    class="w-full"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="stopLat" class="font-semibold text-gray-600 block mb-1">Latitude</label>
                    <p-inputNumber 
                      [(ngModel)]="newStop.lat" 
                      [minFractionDigits]="6"
                      [maxFractionDigits]="6"
                      placeholder="28.613900"
                      class="w-full"
                    ></p-inputNumber>
                  </div>
                  <div>
                    <label for="stopLng" class="font-semibold text-gray-600 block mb-1">Longitude</label>
                    <p-inputNumber 
                      [(ngModel)]="newStop.lng" 
                      [minFractionDigits]="6"
                      [maxFractionDigits]="6"
                      placeholder="77.209000"
                      class="w-full"
                    ></p-inputNumber>
                  </div>
                </div>

                <p-button 
                  label="Add Stop" 
                  icon="pi pi-plus" 
                  (click)="addStop()"
                  [disabled]="!isValidStop()"
                  class="w-full"
                ></p-button>

                <div>
                  <p-button 
                    label="Add Stop by Map Click" 
                    icon="pi pi-map-marker" 
                    severity="secondary"
                    (click)="toggleMapClickMode()"
                    [outlined]="!mapClickMode"
                    class="w-full"
                  ></p-button>
                  <small class="text-gray-500" *ngIf="mapClickMode">Click on map to add stop</small>
                </div>
              </div>
            </p-panel>

            <!-- Route Stops List -->
            <p-panel header="Route Stops ({{ stops.length }})">
              <p-scrollPanel [style]="{ width: '100%', height: '300px' }" *ngIf="stops.length > 0">
                <div class="pr-2 space-y-2">
                  <div 
                    *ngFor="let stop of stops; let i = index" 
                    class="p-3 rounded border border-gray-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div class="flex justify-between">
                      <div>
                        <div class="font-semibold text-blue-600 mb-1">
                          {{ i + 1 }}. {{ stop.name }}
                        </div>
                        <div class="text-sm text-gray-600">
                          Lat: {{ stop.lat | number:'1.6-6' }}<br>
                          Lng: {{ stop.lng | number:'1.6-6' }}
                        </div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <p-button icon="pi pi-pencil" size="small" severity="secondary" [outlined]="true" (click)="editStop(stop)" pTooltip="Edit Stop"></p-button>
                        <p-button icon="pi pi-trash" size="small" severity="danger" [outlined]="true" (click)="removeStop(stop.id)" pTooltip="Remove Stop"></p-button>
                      </div>
                    </div>
                  </div>
                </div>
              </p-scrollPanel>
              <div *ngIf="stops.length === 0" class="text-center text-gray-500 py-4">
                No stops added yet
              </div>
            </p-panel>

            <!-- Route Actions -->
            <p-panel header="Route Actions">
              <div class="space-y-3">
                <p-button 
                  label="Calculate Route" 
                  icon="pi pi-directions" 
                  (click)="calculateRoute()"
                  [disabled]="stops.length < 2"
                  class="w-full"
                ></p-button>
                
                <p-button 
                  label="Clear All Stops" 
                  icon="pi pi-trash" 
                  severity="danger"
                  [outlined]="true"
                  (click)="clearAllStops()"
                  [disabled]="stops.length === 0"
                  class="w-full"
                ></p-button>
                
                <p-button 
                  label="Export GeoJSON" 
                  icon="pi pi-download" 
                  severity="success"
                  [outlined]="true"
                  (click)="exportGeoJSON()"
                  [disabled]="!routeData.routeGeometry"
                  class="w-full"
                ></p-button>
              </div>
            </p-panel>

            <!-- Route Info -->
            <p-panel header="Route Information" *ngIf="routeData.totalDistance">
              <div class="bg-gray-50 p-4 rounded border border-gray-200 space-y-2">
                <div class="flex justify-between">
                  <span class="font-semibold">Total Distance:</span>
                  <span>{{ (routeData.totalDistance! / 1000) | number:'1.2-2' }} km</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Estimated Time:</span>
                  <span>{{ formatDuration(routeData.totalDuration!) }}</span>
                </div>
              </div>
            </p-panel>

          </div>
        </p-card>
      </div>

      <!-- Right Panel - Map -->
      <div class="lg:col-span-8 w-full h-full">
        <p-card>
          <div 
            #mapContainer 
            class="w-full h-[600px] bg-gray-200 rounded border border-gray-300 overflow-hidden"
          ></div>
        </p-card>
      </div>
    </div>

    <!-- Edit Stop Dialog -->
    <p-dialog 
      header="Edit Stop" 
      [(visible)]="showEditDialog" 
      [modal]="true" 
      [style]="{ width: '400px' }"
    >
      <div class="space-y-4" *ngIf="editingStop">
        <div>
          <label for="editStopName" class="font-semibold text-gray-600 block mb-1">Stop Name</label>
          <input 
            pInputText 
            id="editStopName" 
            [(ngModel)]="editingStop.name"
            class="w-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="editStopLat" class="font-semibold text-gray-600 block mb-1">Latitude</label>
            <p-inputNumber 
              [(ngModel)]="editingStop.lat" 
              [minFractionDigits]="6"
              [maxFractionDigits]="6"
              class="w-full"
            ></p-inputNumber>
          </div>
          <div>
            <label for="editStopLng" class="font-semibold text-gray-600 block mb-1">Longitude</label>
            <p-inputNumber 
              [(ngModel)]="editingStop.lng" 
              [minFractionDigits]="6"
              [maxFractionDigits]="6"
              class="w-full"
            ></p-inputNumber>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" severity="secondary" [outlined]="true" (click)="cancelEdit()"></p-button>
        <p-button label="Save" icon="pi pi-check" (click)="saveEdit()"></p-button>
      </ng-template>
    </p-dialog>
  </div>
`,
styles: []

})
export class RouteCreatorComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Output() routeDataChanged = new EventEmitter<RouteData>();

  // HERE Maps
  private platform: any;
  private map: any;
  behavior: any;
  ui: any;
  private routingService: any;
  
  // Component state
  stops: RouteStop[] = [
  {
    id: '1',
    name: 'Shadipur',
    lat: 28.6519,
    lng: 77.1488
  },
  {
    id: '2',
    name: 'Rajouri Garden',
    lat: 28.6517,
    lng: 77.1235
  }
];;
  routeData: RouteData = { stops: [] };
  mapClickMode = false;
  
  // New stop form
  newStop = {
    name: '',
    lat: null as number | null,
    lng: null as number | null
  };

  // Edit dialog
  showEditDialog = false;
  editingStop: RouteStop | null = null;
  editingStopBackup: RouteStop | null = null;

  // HERE Maps API Key - Replace with your actual API key
  private readonly HERE_API_KEY = 'bhm0avrp9LuWfcoxd6E8Uzv1oZn3i2Mfcrsv77Bnw7Y';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadHereMapsAPI();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.getViewPort().dispose();
    }
  }

  private loadHereMapsAPI() {
    // Check if HERE Maps API is already loaded
    if (typeof H !== 'undefined' && H.service && H.Map) {
      this.initializeMap();
      return;
    }

    // Load HERE Maps API scripts in sequence
    this.loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js')
      .then(() => this.loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js'))
      .then(() => this.loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js'))
      .then(() => this.loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'))
      .then(() => {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
        document.head.appendChild(link);
        
        // Wait a bit for all scripts to be fully ready
        setTimeout(() => {
          this.initializeMap();
        }, 500);
      })
      .catch(error => {
        console.error('Error loading HERE Maps API:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Map Loading Error',
          detail: 'Failed to load HERE Maps API'
        });
      });
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private initializeMap() {
    setTimeout(() => {
      if (!this.mapContainer?.nativeElement) {
        console.error('Map container not found');
        return;
      }

      try {
        // Validate HERE Maps API availability
        if (typeof H === 'undefined' || !H.service || !H.Map) {
          throw new Error('HERE Maps API not properly loaded');
        }
        console.log(this.HERE_API_KEY);
        
        // Check API key
        if (!this.HERE_API_KEY) {
          this.messageService.add({
            severity: 'error',
            summary: 'API Key Missing',
            detail: 'Please set your HERE Maps API key in the component'
          });
          return;
        }

        // Initialize platform with API key
        this.platform = new H.service.Platform({
          'apikey': this.HERE_API_KEY
        });

        // Obtain the default map types from the platform
        const defaultLayers = this.platform.createDefaultLayers();

        // Validate default layers
        if (!defaultLayers || !defaultLayers.vector || !defaultLayers.vector.normal) {
          throw new Error('Failed to create default map layers');
        }

        // Initialize the map
        this.map = new H.Map(
          this.mapContainer.nativeElement,
          defaultLayers.vector.normal.map,
          {
            zoom: 13,
            center: { lat: 28.6139, lng: 77.2090 } // Delhi
          }
        );

        // Make the map interactive
        this.behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
        this.ui = new H.ui.UI.createDefault(this.map, defaultLayers);

        // Initialize routing service
        this.routingService = this.platform.getRoutingService();
        console.log(this.routingService,'service');
        

        // Add map click listener
        this.map.addEventListener('tap', (evt: any) => {
          if (this.mapClickMode) {
            const coord = this.map.screenToGeo(
              evt.currentPointer.viewportX,
              evt.currentPointer.viewportY
            );
            this.addStopFromMap(coord.lat, coord.lng);
          }
        });

        // Get user location
        this.getUserLocation();

        this.messageService.add({
          severity: 'success',
          summary: 'Map Loaded',
          detail: 'HERE Maps initialized successfully'
        });

      } catch (error) {
        console.error('Map initialization error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Map Initialization Failed',
          detail: 'Failed to initialize HERE Maps. Please check your API key and network connection.'
        });
      }
    }, 100);
  }

  private getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.map.setCenter(userLocation);
          this.map.setZoom(15);

          // Add user location marker
          const userIcon = new H.map.Icon(
            '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#007cff" stroke="white" stroke-width="3"/></svg>',
            { size: { w: 20, h: 20 } }
          );
          
          const userMarker = new H.map.Marker(userLocation, { icon: userIcon });
          this.map.addObject(userMarker);

          this.messageService.add({
            severity: 'success',
            summary: 'Location Found',
            detail: 'Map centered on your location'
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.messageService.add({
            severity: 'warn',
            summary: 'Location Error',
            detail: 'Could not get your location'
          });
        }
      );
    }
  }

  isValidStop(): boolean {
    return !!(this.newStop.name?.trim() && 
             this.newStop.lat !== null && 
             this.newStop.lng !== null);
  }

  addStop() {
    if (!this.isValidStop()) return;

    const stop: RouteStop = {
      id: this.generateId(),
      name: this.newStop.name!.trim(),
      lat: this.newStop.lat!,
      lng: this.newStop.lng!
    };

    this.stops.push(stop);
    this.addMarkerToMap(stop);
    this.clearNewStopForm();
    this.updateRouteData();

    this.messageService.add({
      severity: 'success',
      summary: 'Stop Added',
      detail: `${stop.name} added to route`
    });
  }

  addStopFromMap(lat: number, lng: number) {
    const stopName = `Stop ${this.stops.length + 1}`;
    
    const stop: RouteStop = {
      id: this.generateId(),
      name: stopName,
      lat: lat,
      lng: lng
    };

    this.stops.push(stop);
    this.addMarkerToMap(stop);
    this.updateRouteData();
    this.mapClickMode = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Stop Added',
      detail: `${stop.name} added from map`
    });
  }

  private addMarkerToMap(stop: RouteStop) {
    const icon = new H.map.Icon(
      `<svg width="30" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="#e74c3c"/>
        <circle cx="15" cy="15" r="8" fill="white"/>
        <text x="15" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#e74c3c">${this.stops.length}</text>
      </svg>`,
      { size: { w: 30, h: 40 }, anchor: { x: 15, y: 40 } }
    );

    const marker = new H.map.Marker({ lat: stop.lat, lng: stop.lng }, { icon: icon });
    marker.setData(stop);
    
    // Make marker draggable
    marker.draggable = true;
    
    // Add drag event listener
    marker.addEventListener('dragend', (evt: any) => {
      const position = evt.target.getGeometry();
      stop.lat = position.lat;
      stop.lng = position.lng;
      this.updateRouteData();
      
      this.messageService.add({
        severity: 'info',
        summary: 'Stop Moved',
        detail: `${stop.name} location updated`
      });
    });

    stop.marker = marker;
    this.map.addObject(marker);
  }

  removeStop(stopId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this stop?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const stopIndex = this.stops.findIndex(s => s.id === stopId);
        if (stopIndex > -1) {
          const stop = this.stops[stopIndex];
          if (stop.marker) {
            this.map.removeObject(stop.marker);
          }
          this.stops.splice(stopIndex, 1);
          this.updateRouteData();
          this.clearRoute();
          
          this.messageService.add({
            severity: 'success',
            summary: 'Stop Removed',
            detail: 'Stop removed from route'
          });
        }
      }
    });
  }

  editStop(stop: RouteStop) {
    this.editingStop = { ...stop };
    this.editingStopBackup = { ...stop };
    this.showEditDialog = true;
  }

  saveEdit() {
    if (!this.editingStop) return;

    const originalStop = this.stops.find(s => s.id === this.editingStop!.id);
    if (originalStop) {
      originalStop.name = this.editingStop.name;
      originalStop.lat = this.editingStop.lat;
      originalStop.lng = this.editingStop.lng;

      // Update marker position
      if (originalStop.marker) {
        originalStop.marker.setGeometry({ lat: originalStop.lat, lng: originalStop.lng });
      }

      this.updateRouteData();
      this.clearRoute();
    }

    this.showEditDialog = false;
    this.editingStop = null;
    this.editingStopBackup = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Stop Updated',
      detail: 'Stop information updated'
    });
  }

  cancelEdit() {
    this.showEditDialog = false;
    this.editingStop = null;
    this.editingStopBackup = null;
  }

  clearAllStops() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear all stops?',
      header: 'Confirm Clear All',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stops.forEach(stop => {
          if (stop.marker) {
            this.map.removeObject(stop.marker);
          }
        });
        
        this.stops = [];
        this.clearRoute();
        this.updateRouteData();
        
        this.messageService.add({
          severity: 'success',
          summary: 'All Stops Cleared',
          detail: 'All stops removed from route'
        });
      }
    });
  }

  toggleMapClickMode() {
    this.mapClickMode = !this.mapClickMode;
    
    this.messageService.add({
      severity: 'info',
      summary: this.mapClickMode ? 'Map Click Enabled' : 'Map Click Disabled',
      detail: this.mapClickMode ? 'Click on map to add stops' : 'Map click mode disabled'
    });
  }

  calculateRoute() {
    if (this.stops.length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Insufficient Stops',
        detail: 'At least 2 stops are required for routing'
      });
      return;
    }

    if (!this.routingService) {
      this.messageService.add({
        severity: 'error',
        summary: 'Routing Service Error',
        detail: 'Routing service not initialized'
      });
      return;
    }

    // Clear existing route
    this.clearRoute();

    try {
      // Prepare route parameters for HERE Routing API v8
      const routeParams: any = {
        mode: 'fastest;car',
         waypoint0: 'geo!37.80221,-122.4191',
         waypoint1: 'geo!37.76839,-122.51089',
         representation: 'display'
      };

      // Add intermediate waypoints (via points)
      if (this.stops.length > 2) {
        const viaPoints = this.stops.slice(1, -1).map(stop => `${stop.lat},${stop.lng}`);
        routeParams.via = viaPoints.join('!');
      }

      // Use the newer routing API format
      this.routingService.calculateRoute(
        routeParams,
        (result: any) => {
          try {
            if (result && result.routes && result.routes[0]) {
              const route = result.routes[0];
              this.displayRouteV8(route);
              this.updateRouteInfoV8(route);
              
              this.messageService.add({
                severity: 'success',
                summary: 'Route Calculated',
                detail: 'Route calculated successfully'
              });
            } else {
              throw new Error('No route found in response');
            }
          } catch (error) {
            console.error('Route processing error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Route Processing Error',
              detail: 'Failed to process route data'
            });
          }
        },
        (error: any) => {
          console.error('Routing API error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Routing Error',
            detail: 'Failed to calculate route. Please check your API key and network connection.'
          });
        }
      );
    } catch (error) {
      console.error('Route calculation error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Route Calculation Error',
        detail: 'An error occurred while calculating the route'
      });
    }
  }

  private displayRouteV8(route: any) {
    try {
      const polyline = route.sections[0].polyline;
      const lineString = H.geo.LineString.fromFlexiblePolyline(polyline);

      const routeLine = new H.map.Polyline(lineString, {
        style: {
          strokeColor: '#007cff',
          lineWidth: 6,
          lineCap: 'round',
          lineJoin: 'round'
        }
      });

      this.map.addObject(routeLine);
      this.routeData.routeGeometry = routeLine;

      // Fit view to route
      this.map.getViewModel().setLookAtData({
        bounds: routeLine.getBoundingBox()
      });
    } catch (error) {
      console.error('Route display error:', error);
      // Fallback to simple line if polyline decoding fails
      this.displaySimpleRoute();
    }
  }

  private displaySimpleRoute() {
    const lineString = new H.geo.LineString();
    
    this.stops.forEach(stop => {
      lineString.pushPoint({ lat: stop.lat, lng: stop.lng });
    });

    const routeLine = new H.map.Polyline(lineString, {
      style: {
        strokeColor: '#007cff',
        lineWidth: 6,
        lineCap: 'round',
        lineJoin: 'round'
      }
    });

    this.map.addObject(routeLine);
    this.routeData.routeGeometry = routeLine;

    // Fit view to route
    this.map.getViewModel().setLookAtData({
      bounds: routeLine.getBoundingBox()
    });
  }

  private updateRouteInfoV8(route: any) {
    try {
      const summary = route.sections[0].summary;
      this.routeData.totalDistance = summary.length;
      this.routeData.totalDuration = summary.duration;
    } catch (error) {
      console.error('Route info update error:', error);
      // Set default values
      this.routeData.totalDistance = 0;
      this.routeData.totalDuration = 0;
    }
  }

  private displayRoute(route: any) {
    const shape = route.shape;
    const lineString = new H.geo.LineString();

    shape.forEach((point: string) => {
      const [lat, lng] = point.split(',').map(Number);
      lineString.pushPoint({ lat, lng });
    });

    const routeLine = new H.map.Polyline(lineString, {
      style: {
        strokeColor: '#007cff',
        lineWidth: 6,
        lineCap: 'round',
        lineJoin: 'round'
      }
    });

    routeLine.draggable = true;
    this.map.addObject(routeLine);

    // Store route data
    this.routeData.routeGeometry = routeLine;

    // Fit view to route
    this.map.getViewModel().setLookAtData({
      bounds: routeLine.getBoundingBox()
    });
  }

  private updateRouteInfo(route: any) {
    const summary = route.summary;
    this.routeData.totalDistance = summary.distance;
    this.routeData.totalDuration = summary.trafficTime || summary.baseTime;
  }

  private clearRoute() {
    if (this.routeData.routeGeometry) {
      this.map.removeObject(this.routeData.routeGeometry);
      this.routeData.routeGeometry = null;
      this.routeData.totalDistance = undefined;
      this.routeData.totalDuration = undefined;
    }
  }

  exportGeoJSON() {
    if (!this.routeData.routeGeometry) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Route',
        detail: 'Calculate a route first before exporting'
      });
      return;
    }

    const geoJson = {
      type: 'FeatureCollection',
      features: [
        // Route line
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: this.getRouteCoordinates()
          },
          properties: {
            type: 'route',
            distance: this.routeData.totalDistance,
            duration: this.routeData.totalDuration
          }
        },
        // Stops
        ...this.stops.map((stop, index) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [stop.lng, stop.lat]
          },
          properties: {
            type: 'stop',
            name: stop.name,
            order: index + 1
          }
        }))
      ]
    };

    this.routeData.geoJson = geoJson;
    this.routeDataChanged.emit(this.routeData);

    // Download GeoJSON file
    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-${new Date().toISOString().split('T')[0]}.geojson`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'GeoJSON file downloaded successfully'
    });
  }

  private getRouteCoordinates(): number[][] {
    if (!this.routeData.routeGeometry) return [];
    
    const lineString = this.routeData.routeGeometry.getGeometry();
    const coordinates: number[][] = [];
    
    lineString.eachLatLngAlt((lat: number, lng: number) => {
      coordinates.push([lng, lat]);
    });
    
    return coordinates;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private clearNewStopForm() {
    this.newStop = {
      name: '',
      lat: null,
      lng: null
    };
  }

  private updateRouteData() {
    this.routeData.stops = [...this.stops];
    this.routeDataChanged.emit(this.routeData);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}