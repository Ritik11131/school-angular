import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

import * as L from 'leaflet';

interface RoutePoint {
  id: string;
  type: 'start' | 'stop' | 'end';
  latlng: L.LatLng;
  marker: L.Marker;
}

interface RouteData {
  points: RoutePoint[];
  linestring: L.Polyline | null;
  totalDistance: number;
}

@Component({
  selector: 'app-route-creator',
  standalone: true,
  imports: [CommonModule, LeafletModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
   <!-- Fixed template with proper map container -->
<div class="route-creator">
  <!-- Top Toolbar - Clean icon-only design -->
  <div class="flex align-items-center justify-content-between p-2 bg-white border-bottom-1 surface-border shadow-1">
    <!-- Left toolbar section -->
    <div class="flex align-items-center gap-2">
      <!-- Drawing tools group -->
      <div class="flex align-items-center gap-1 p-1 bg-gray-50 border-round">
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          [class.tool-btn-active]="currentTool === 'linestring'"
          (click)="setTool('linestring')"
          title="Draw LineString">
          <i class="pi pi-arrow-up-right-and-arrow-down-left-from-center text-lg"></i>
        </button>
      </div>
      
      <!-- Import/Export tools group -->
      <div class="flex align-items-center gap-1 p-1 bg-gray-50 border-round">
        <input 
          #fileInput 
          type="file" 
          accept=".geojson,.json" 
          (change)="importGeoJSON($event)"
          style="display: none">
        
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          (click)="triggerFileInput()"
          title="Import GeoJSON">
          <i class="pi pi-download text-base"></i>
        </button>
        
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          [class.tool-btn-disabled]="!hasAnyData"
          (click)="exportGeoJSON()"
          [disabled]="!hasAnyData"
          title="Export GeoJSON">
          <i class="pi pi-upload text-base"></i>
        </button>
      </div>
      
      <!-- Marker tools group -->
      <div class="flex align-items-center gap-1 p-1 bg-gray-50 border-round">
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          [class.tool-btn-start]="currentTool === 'start'"
          (click)="setTool('start')"
          title="Add Start Point">
          <i class="pi pi-play text-base"></i>
        </button>
        
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          [class.tool-btn-stop]="currentTool === 'stop'"
          (click)="setTool('stop')"
          title="Add Stop Point">
          <i class="pi pi-circle-fill text-base"></i>
        </button>
        
        <button 
          class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
          [class.tool-btn-end]="currentTool === 'end'"
          (click)="setTool('end')"
          title="Add End Point">
          <i class="pi pi-stop text-base"></i>
        </button>
      </div>
    </div>
    
    <!-- Right toolbar section -->
    <div class="flex align-items-center gap-1 p-1 bg-gray-50 border-round">
      <button 
        class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
        [class.tool-btn-disabled]="!hasAnyData"
        (click)="clearAll()"
        [disabled]="!hasAnyData"
        title="Clear All">
        <i class="pi pi-trash text-base"></i>
      </button>
      
      <button 
        class="tool-btn p-2 border-round border-none bg-transparent text-600 cursor-pointer transition-all transition-duration-200"
        [class.tool-btn-disabled]="!hasAnyData"
        (click)="fitBounds()"
        [disabled]="!hasAnyData"
        title="Fit to View">
        <i class="pi pi-expand text-base"></i>
      </button>
    </div>
  </div>
  
  <!-- Status Bar -->
  <div class="flex align-items-center justify-content-between p-2 bg-gray-50 border-bottom-1 surface-border text-sm text-600" 
       *ngIf="currentTool || hasAnyData">
    <div class="flex align-items-center gap-4">
      <span *ngIf="currentTool" class="text-primary font-medium">
        {{ getToolStatusText() }}
      </span>
    </div>
    
    <div class="flex align-items-center gap-4" *ngIf="hasAnyData">
      <span class="text-700">
        {{ getStatusInfo() }}
      </span>
    </div>
  </div>
  
  <!-- Map Container - Fixed with explicit height and background -->
  <div 
    #mapContainer
    class="map-container"
    style="height: 500px; width: 100%; background-color: #f5f5f5; border: 1px solid #ddd; position: relative;"
    leaflet 
    [leafletOptions]="mapOptions" 
    (leafletMapReady)="onMapReady($event)">
    
    <!-- Loading indicator (optional) -->
    <div *ngIf="!mapReady" 
         class="flex align-items-center justify-content-center h-full w-full absolute top-0 left-0 bg-gray-100">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-2xl text-primary mb-2"></i>
        <p class="text-sm text-600">Loading map...</p>
      </div>
    </div>
  </div>
</div>
    
    <p-toast></p-toast>
  `,
  styles: [`
    .route-creator {
     
    }
    
    .toolbar {
      background: #fff;
      border-bottom: 1px solid #ddd;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    
    .toolbar-section {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .tool-group {
      display: flex;
      background: #f8f9fa;
      border-radius: 6px;
      padding: 2px;
      border: 1px solid #e9ecef;
    }
    
    .tool-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: #495057;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    
    .tool-btn:hover {
      background: #e9ecef;
      color: #212529;
    }
    
    .tool-btn.active {
      background: #007bff;
      color: white;
      box-shadow: 0 2px 4px rgba(0,123,255,0.3);
    }
    
    .tool-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .tool-btn.secondary {
      background: #6c757d;
      color: white;
    }
    
    .tool-btn.secondary:hover:not(:disabled) {
      background: #5a6268;
    }
    
    .marker-start.active {
      background: #28a745;
    }
    
    .marker-stop.active {
      background: #17a2b8;
    }
    
    .marker-end.active {
      background: #dc3545;
    }
    
    .status-bar {
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #6c757d;
    }
    
    .status-section {
      display: flex;
      gap: 16px;
    }
    
    .status-tool {
      color: #007bff;
      font-weight: 500;
    }
    
    .status-info {
      color: #495057;
    }
    
    .map-container {
     
    }
    
    /* Custom map cursor styles */
    .map-container.drawing-mode {
      cursor: crosshair !important;
    }
    
    .map-container.marker-mode {
      cursor: pointer !important;
    }
    
    /* Custom marker styles */
    :global(.custom-route-marker) {
      background: transparent !important;
      border: none !important;
    }
    
    :global(.user-location-marker) {
      background: transparent !important;
      border: none !important;
    }
    
    /* Leaflet draw styles override */
    :global(.leaflet-draw-tooltip) {
      font-size: 12px !important;
      background: rgba(0,0,0,0.8) !important;
      color: white !important;
    }
    
    /* Custom drawing tooltips */
    :global(.drawing-tooltip) {
      background: rgba(79, 70, 229, 0.9) !important;
      color: white !important;
      border: none !important;
      border-radius: 4px !important;
      font-size: 11px !important;
      font-weight: 500 !important;
      padding: 4px 8px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    }
    
    :global(.drawing-tooltip::before) {
      border-top-color: rgba(79, 70, 229, 0.9) !important;
    }
    
    /* Professional line animations */
    :global(.leaflet-interactive:hover) {
      transition: all 0.2s ease !important;
    }
    
    /* Enhanced cursor styles */
    .map-container.drawing-mode {
      cursor: crosshair !important;
    }
    
    .map-container.drawing-mode:hover {
      cursor: copy !important;
    }
  `]
})
export class RouteCreatorComponent implements OnInit, OnDestroy {

   @Output() routeDataChanged = new EventEmitter<any>();
   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  map!: L.Map;
  routeData: RouteData = {
    points: [],
    linestring: null,
    totalDistance: 0
  };
  mapReady = false; // Add this if you want the loading indicator
  
  currentTool: 'linestring' | 'start' | 'stop' | 'end' | null = null;
  
  // Drawing state
  isDrawing = false;
  currentLinePoints: L.LatLng[] = [];
  tempLine: L.Polyline | null = null;
  drawingPoints: L.CircleMarker[] = [];
  hoverPoint: L.CircleMarker | null = null;
  drawingLayer!: L.LayerGroup;
  markersLayer!: L.LayerGroup;
  
  userLocation: L.LatLng | null = null;
  
  mapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: L.latLng(28.6139, 77.2090) // Default to Delhi
  };

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    // Set up global remove function
    window.removeRoutePoint = (id: string) => {
      this.removeRoutePoint(id);
    };
  }

  ngOnDestroy() {
    if ((window as any).removeRoutePoint) {
      (window as any).removeRoutePoint = undefined;
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.mapReady = true;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
    
    // Create layers
    this.drawingLayer = L.layerGroup().addTo(this.map);
    this.markersLayer = L.layerGroup().addTo(this.map);
    
    // Get user location
    this.getUserLocationAndZoom();
    
    // Add event listeners
    this.setupMapEventListeners();
  }

  private setupMapEventListeners() {
    // Map click handler
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.currentTool === 'linestring') {
        this.handleLinestringClick(e.latlng);
      } else if (this.currentTool && ['start', 'stop', 'end'].includes(this.currentTool)) {
        this.addRoutePoint(e.latlng, this.currentTool as 'start' | 'stop' | 'end');
      }
    });

    // Mouse move handler for drawing preview
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      if (this.currentTool === 'linestring') {
        this.handleDrawingHover(e.latlng);
      }
    });

    // Key press handler for finishing linestring
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.isDrawing) {
        this.finishLinestring();
      } else if (e.key === 'Escape') {
        this.cancelCurrentOperation();
      }
    });
  }

  private getUserLocationAndZoom() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.userLocation = L.latLng(lat, lng);
          
          this.map.setView(this.userLocation, 15);
          
          const userMarker = L.marker(this.userLocation, {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #007cff; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,124,255,0.5);"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            })
          }).addTo(this.map);
          
          userMarker.bindPopup('Your Location');
          
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

  setTool(tool: 'linestring' | 'start' | 'stop' | 'end') {
    // Cancel any current operation
    this.cancelCurrentOperation();
    
    // Toggle tool
    if (this.currentTool === tool) {
      this.currentTool = null;
      this.updateMapCursor();
    } else {
      this.currentTool = tool;
      this.updateMapCursor();
      
      if (tool === 'linestring' && this.routeData.linestring) {
        this.messageService.add({
          severity: 'warn',
          summary: 'LineString Exists',
          detail: 'Clear existing route to draw a new one'
        });
        this.currentTool = null;
        this.updateMapCursor();
      }
    }
  }

  private updateMapCursor() {
    const container = this.map.getContainer();
    container.classList.remove('drawing-mode', 'marker-mode');
    
    if (this.currentTool === 'linestring') {
      container.classList.add('drawing-mode');
    } else if (this.currentTool && ['start', 'stop', 'end'].includes(this.currentTool)) {
      container.classList.add('marker-mode');
    }
  }

  private handleLinestringClick(latlng: L.LatLng) {
    if (!this.isDrawing) {
      // Start drawing
      this.isDrawing = true;
      this.currentLinePoints = [latlng];
      
      // Create first point marker
      this.addDrawingPoint(latlng, 0);
      
      // Create temporary line (initially just one point, invisible)
      this.tempLine = L.polyline([latlng], {
        color: '#4f46e5',
        weight: 3,
        opacity: 0,
        dashArray: '8, 4',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.drawingLayer);
      
      this.messageService.add({
        severity: 'info',
        summary: 'Drawing Started',
        detail: 'Click to add points, Enter to finish, Esc to cancel'
      });
    } else {
      // Add point to current line
      this.currentLinePoints.push(latlng);
      this.addDrawingPoint(latlng, this.currentLinePoints.length - 1);
      
      // Update line and make it visible
      this.tempLine?.setLatLngs(this.currentLinePoints);
      if (this.tempLine && this.currentLinePoints.length >= 2) {
        this.tempLine.setStyle({ opacity: 0.8 });
      }
    }
  }

  private finishLinestring() {
    if (!this.isDrawing || this.currentLinePoints.length < 2) {
      this.cancelCurrentOperation();
      return;
    }
    
    // Remove temporary elements
    this.clearDrawingHelpers();
    
    // Create final linestring with professional styling
    this.routeData.linestring = L.polyline(this.currentLinePoints, {
      color: '#4f46e5',
      weight: 4,
      opacity: 0.9,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.drawingLayer);
    
    // Add interactive hover effects to the final line
    this.routeData.linestring.on('mouseover', () => {
      this.routeData.linestring?.setStyle({
        color: '#6366f1',
        weight: 5,
        opacity: 1
      });
    });
    
    this.routeData.linestring.on('mouseout', () => {
      this.routeData.linestring?.setStyle({
        color: '#4f46e5',
        weight: 4,
        opacity: 0.9
      });
    });
    
    // Add click handler for line editing (future feature)
    this.routeData.linestring.on('click', () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Route Selected',
        detail: 'LineString editing coming soon!'
      });
    });
    
    // Calculate distance
    this.calculateDistance();
    
    // Reset drawing state
    this.isDrawing = false;
    this.currentLinePoints = [];
    this.currentTool = null;
    this.updateMapCursor();
    
    this.messageService.add({
      severity: 'success',
      summary: 'LineString Created',
      detail: `Professional route drawn with ${this.routeData.linestring.getLatLngs().length} points`
    });

     this.emitRouteData();
  }

  private cancelCurrentOperation() {
    if (this.isDrawing) {
      this.clearDrawingHelpers();
      this.isDrawing = false;
      this.currentLinePoints = [];
      this.messageService.add({
        severity: 'info',
        summary: 'Drawing Cancelled',
        detail: 'LineString drawing cancelled'
      });
    }
  }

  private clearDrawingHelpers() {
    // Remove temporary line
    if (this.tempLine) {
      this.drawingLayer.removeLayer(this.tempLine);
      this.tempLine = null;
    }
    
    // Remove drawing points
    this.drawingPoints.forEach(point => {
      this.drawingLayer.removeLayer(point);
    });
    this.drawingPoints = [];
    
    // Remove hover point
    if (this.hoverPoint) {
      this.drawingLayer.removeLayer(this.hoverPoint);
      this.hoverPoint = null;
    }
  }

  private addDrawingPoint(latlng: L.LatLng, index: number) {
    const point = L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#4f46e5',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(this.drawingLayer);
    
    // Add hover effects to drawing points
    point.on('mouseover', () => {
      point.setStyle({
        radius: 8,
        fillColor: '#6366f1',
        weight: 3
      });
    });
    
    point.on('mouseout', () => {
      point.setStyle({
        radius: 6,
        fillColor: '#4f46e5',
        weight: 2
      });
    });
    
    // Add tooltip
    point.bindTooltip(`Point ${index + 1}`, {
      permanent: false,
      direction: 'top',
      className: 'drawing-tooltip'
    });
    
    this.drawingPoints.push(point);
  }

  private handleDrawingHover(latlng: L.LatLng) {
    if (this.currentTool !== 'linestring') {
      if (this.hoverPoint) {
        this.drawingLayer.removeLayer(this.hoverPoint);
        this.hoverPoint = null;
      }
      return;
    }
    
    // Remove existing hover point
    if (this.hoverPoint) {
      this.drawingLayer.removeLayer(this.hoverPoint);
    }
    
    // Create hover point
    this.hoverPoint = L.circleMarker(latlng, {
      radius: 5,
      fillColor: '#818cf8',
      color: '#ffffff',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.6
    }).addTo(this.drawingLayer);
    
    // If we're currently drawing, show preview line to hover point
    if (this.isDrawing && this.currentLinePoints.length > 0) {
      const previewPoints = [...this.currentLinePoints, latlng];
      this.tempLine?.setLatLngs(previewPoints);
    }
  }

  addRoutePoint(latlng: L.LatLng, type: 'start' | 'stop' | 'end') {
    // Check if start or end already exists and remove it
    if ((type === 'start' || type === 'end')) {
      const existingPoint = this.routeData.points.find(p => p.type === type);
      if (existingPoint) {
        this.removeRoutePointInternal(existingPoint.id, false);
      }
    }

    const pointId = `${type}_${Date.now()}`;
    const marker = this.createMarker(latlng, type, pointId);
    
    const routePoint: RoutePoint = {
      id: pointId,
      type,
      latlng,
      marker
    };

    this.routeData.points.push(routePoint);
    this.markersLayer.addLayer(marker);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Point Added',
      detail: `${type.charAt(0).toUpperCase() + type.slice(1)} point added`
    });

    // Auto-disable tool for start/end
    if (type === 'start' || type === 'end') {
      this.currentTool = null;
      this.updateMapCursor();
    }
  }

  removeRoutePoint(id: string) {
    this.removeRoutePointInternal(id, true);
  }

  private removeRoutePointInternal(id: string, showMessage: boolean = true) {
    const pointIndex = this.routeData.points.findIndex(p => p.id === id);
    if (pointIndex === -1) return;

    const point = this.routeData.points[pointIndex];
    
    this.markersLayer.removeLayer(point.marker);
    this.routeData.points.splice(pointIndex, 1);
    
    if (showMessage) {
      this.messageService.add({
        severity: 'info',
        summary: 'Point Removed',
        detail: `${point.type.charAt(0).toUpperCase() + point.type.slice(1)} point removed`
      });
      this.emitRouteData();
    }
  }

  private createMarker(latlng: L.LatLng, type: 'start' | 'stop' | 'end', id: string): L.Marker {
    let color: string;
    let icon: string;
    
    switch (type) {
      case 'start':
        color = '#28a745';
        icon = '🚀';
        break;
      case 'stop':
        color = '#17a2b8';
        icon = '📍';
        break;
      case 'end':
        color = '#dc3545';
        icon = '🏁';
        break;
    }

    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-route-marker',
        html: `
          <div style="
            background: ${color}; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">${icon}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    });

    marker.bindPopup(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="font-weight: 600; margin-bottom: 8px; color: ${color};">
          ${type.charAt(0).toUpperCase() + type.slice(1)} Point
        </div>
        <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px;">
          ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}
        </div>
        <button onclick="window.removeRoutePoint('${id}')" 
                style="background: #dc3545; color: white; border: none; padding: 6px 12px; 
                       border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
          Remove Point
        </button>
      </div>
    `);

    return marker;
  }

  private calculateDistance() {
    if (!this.routeData.linestring) {
      this.routeData.totalDistance = 0;
      return;
    }
    
    const points = this.routeData.linestring.getLatLngs() as L.LatLng[];
    this.routeData.totalDistance = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      this.routeData.totalDistance += points[i].distanceTo(points[i + 1]) / 1000;
    }
  }

  clearAll() {
    // Cancel any current operation
    this.cancelCurrentOperation();
    
    // Clear layers
    this.drawingLayer.clearLayers();
    this.markersLayer.clearLayers();
    
    // Reset data
    this.routeData = {
      points: [],
      linestring: null,
      totalDistance: 0
    };
    
    // Clear drawing helpers
    this.drawingPoints = [];
    this.hoverPoint = null;
    
    this.currentTool = null;
    this.updateMapCursor();
    
    // Re-add user location marker
    if (this.userLocation) {
      const userMarker = L.marker(this.userLocation, {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: '<div style="background: #007cff; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,124,255,0.5);"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        })
      }).addTo(this.map);
      
      userMarker.bindPopup('Your Location');
    }
    
    this.messageService.add({
      severity: 'info',
      summary: 'Cleared',
      detail: 'All route data has been removed'
    });

    this.emitRouteData();
  }

  fitBounds() {
    if (!this.hasAnyData) return;
    
    const allLayers: L.Layer[] = [];
    
    if (this.routeData.linestring) {
      allLayers.push(this.routeData.linestring);
    }
    
    this.routeData.points.forEach(point => {
      allLayers.push(point.marker);
    });
    
    if (allLayers.length > 0) {
      const group = L.featureGroup(allLayers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Template helper methods
  get hasAnyData(): boolean {
    return this.routeData.points.length > 0 || this.routeData.linestring !== null;
  }

  get hasStart(): boolean {
    return this.routeData.points.some(p => p.type === 'start');
  }

  get hasEnd(): boolean {
    return this.routeData.points.some(p => p.type === 'end');
  }

  get stopCount(): number {
    return this.routeData.points.filter(p => p.type === 'stop').length;
  }

  getToolStatusText(): string {
    switch (this.currentTool) {
      case 'linestring':
        return this.isDrawing ? 
          'Drawing LineString - Click to add points, Enter to finish, Esc to cancel' : 
          'Click on map to start drawing route';
      case 'start':
        return 'Click on map to add START point';
      case 'stop':
        return 'Click on map to add STOP point';
      case 'end':
        return 'Click on map to add END point';
      default:
        return '';
    }
  }

  getStatusInfo(): string {
    const parts: string[] = [];
    
    if (this.routeData.linestring) {
      const pointCount = (this.routeData.linestring.getLatLngs() as L.LatLng[]).length;
      parts.push(`LineString: ${pointCount} points`);
    }
    
    if (this.routeData.points.length > 0) {
      const markers = [
        this.hasStart ? 'Start' : null,
        this.stopCount > 0 ? `${this.stopCount} Stop${this.stopCount > 1 ? 's' : ''}` : null,
        this.hasEnd ? 'End' : null
      ].filter(Boolean);
      
      if (markers.length > 0) {
        parts.push(`Markers: ${markers.join(', ')}`);
      }
    }
    
    if (this.routeData.totalDistance > 0) {
      parts.push(`Distance: ${this.routeData.totalDistance.toFixed(2)} km`);
    }
    
    return parts.join(' | ');
  }


   // Import GeoJSON functionality
  importGeoJSON(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.geojson') && !file.name.toLowerCase().endsWith('.json')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please select a GeoJSON (.geojson or .json) file'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJsonData = JSON.parse(e.target?.result as string);
        this.loadGeoJSONData(geoJsonData);
        
        // Clear the input value so the same file can be selected again
        input.value = '';
        
        this.messageService.add({
          severity: 'success',
          summary: 'Import Successful',
          detail: 'GeoJSON data loaded successfully'
        });
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Import Failed',
          detail: 'Invalid GeoJSON format'
        });
      }
    };
    
    reader.readAsText(file);
  }

  // Load GeoJSON data into the map
  private loadGeoJSONData(geoJson: any) {
    // Clear existing data first
    this.clearAll();
    
    if (!geoJson.features || !Array.isArray(geoJson.features)) {
      throw new Error('Invalid GeoJSON structure');
    }
    
    geoJson.features.forEach((feature: any) => {
      if (feature.geometry && feature.geometry.coordinates) {
        switch (feature.geometry.type) {
          case 'LineString':
            this.loadLineString(feature.geometry.coordinates);
            break;
          case 'Point':
            this.loadPoint(feature.geometry.coordinates, feature.properties);
            break;
        }
      }
    });
    
    // Fit map to imported data
    setTimeout(() => {
      this.fitBounds();
    }, 100);
    
    // Calculate distance for imported linestring
    this.calculateDistance();
    
    // Emit the loaded data
    this.emitRouteData();
  }

  // Load LineString from coordinates
  private loadLineString(coordinates: number[][]) {
    const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));
    
    this.routeData.linestring = L.polyline(latLngs, {
      color: '#4f46e5',
      weight: 4,
      opacity: 0.9,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.drawingLayer);
    
    // Add interactive hover effects
    this.routeData.linestring.on('mouseover', () => {
      this.routeData.linestring?.setStyle({
        color: '#6366f1',
        weight: 5,
        opacity: 1
      });
    });
    
    this.routeData.linestring.on('mouseout', () => {
      this.routeData.linestring?.setStyle({
        color: '#4f46e5',
        weight: 4,
        opacity: 0.9
      });
    });
  }

  // Load Point from coordinates and properties
  private loadPoint(coordinates: number[], properties: any) {
    const latlng = L.latLng(coordinates[1], coordinates[0]);
    let pointType: 'start' | 'stop' | 'end' = 'stop';
    
    // Determine point type from properties
    if (properties && properties.type) {
      const type = properties.type.toLowerCase();
      if (['start', 'stop', 'end'].includes(type)) {
        pointType = type as 'start' | 'stop' | 'end';
      }
    } else if (properties && properties.marker) {
      // Alternative property name for marker type
      const type = properties.marker.toLowerCase();
      if (['start', 'stop', 'end'].includes(type)) {
        pointType = type as 'start' | 'stop' | 'end';
      }
    }
    
    this.addRoutePoint(latlng, pointType);
  }

  // Export GeoJSON functionality
  exportGeoJSON() {
    if (!this.hasAnyData) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No route data to export'
      });
      return;
    }

    const geoJson = this.generateGeoJSON();
    
    // Create and download file
    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route_${new Date().toISOString().split('T')[0]}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'GeoJSON file downloaded'
    });
    
    // Also emit the GeoJSON data
    this.emitRouteData();
  }

  // Generate GeoJSON from current route data
  generateGeoJSON(): any {
    const features: any[] = [];
    
    // Add LineString feature
    if (this.routeData.linestring) {
      const coordinates = (this.routeData.linestring.getLatLngs() as L.LatLng[])
        .map(latlng => [latlng.lng, latlng.lat]);
      
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        },
        properties: {
          type: 'route',
          distance: this.routeData.totalDistance,
          points: coordinates.length
        }
      });
    }
    
    // Add Point features
    this.routeData.points.forEach(point => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.latlng.lng, point.latlng.lat]
        },
        properties: {
          type: point.type,
          id: point.id
        }
      });
    });
    
    return {
      type: 'FeatureCollection',
      features: features,
      properties: {
        created: new Date().toISOString(),
        totalDistance: this.routeData.totalDistance,
        pointCount: this.routeData.points.length
      }
    };
  }

  // Emit route data to parent component
  private emitRouteData() {
    const geoJson = this.generateGeoJSON();
    this.routeDataChanged.emit({
      geoJson: geoJson,
      routeData: {
        totalDistance: this.routeData.totalDistance,
        pointCount: this.routeData.points.length,
        hasLineString: !!this.routeData.linestring,
        hasStart: this.hasStart,
        hasEnd: this.hasEnd,
        stopCount: this.stopCount
      }
    });
  }

   // Trigger file input
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}

// Global function for popup remove buttons
declare global {
  interface Window {
    removeRoutePoint: (id: string) => void;
  }
}