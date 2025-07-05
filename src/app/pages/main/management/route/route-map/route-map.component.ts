// route-map.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

// GeoJSON Type Definitions
interface GeoJSONProperties {
  name: string;
  time?: string;
}

interface GeoJSONGeometry {
  type: 'Point' | 'LineString';
  coordinates: number[] | number[][];
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: GeoJSONProperties;
  geometry: GeoJSONGeometry;
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Route Analysis Interface
interface RouteAnalysis {
  start: GeoJSONFeature | null;
  end: GeoJSONFeature | null;
  stops: GeoJSONFeature[];
  route: GeoJSONFeature | null;
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div #mapElement class="map-element" [style.height]="height"></div>
      <div class="map-controls">
        <button (click)="fitBounds()" class="control-btn">
          <span>📍</span> Fit to Route
        </button>
        <button (click)="toggleAnimation()" class="control-btn">
          <span>{{isAnimating ? '⏸️' : '▶️'}}</span> {{isAnimating ? 'Pause' : 'Play'}} Animation
        </button>
        <button (click)="exportGeoJSON()" class="control-btn">
          <span>💾</span> Export GeoJSON
        </button>
      </div>
      <div class="route-info" *ngIf="routeAnalysis">
        <h3>Route Information</h3>
        <div class="info-item">
          <strong>Start:</strong> {{ routeAnalysis.start?.properties?.name || 'Unknown' }}
        </div>
        <div class="info-item">
          <strong>End:</strong> {{ routeAnalysis.end?.properties?.name || 'Unknown' }}
        </div>
        <div class="info-item">
          <strong>Stops:</strong> {{ routeAnalysis.stops.length }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .map-element {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .map-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      display: flex;
      gap: 8px;
      flex-direction: column;
    }
    
    .control-btn {
      background: rgba(255, 255, 255, 0.95);
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .control-btn:hover {
      background: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .route-info {
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      font-size: 12px;
      min-width: 200px;
    }
    
    .route-info h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #333;
    }
    
    .info-item {
      margin: 4px 0;
      color: #666;
    }
    
    .info-item strong {
      color: #333;
    }
  `]
})
export class RouteMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  @Input() geoJsonData: GeoJSONData | null = null;
  @Input() height: string = '500px';
  @Output() geoJsonExport = new EventEmitter<GeoJSONData>();
  
  private map: L.Map | null = null;
  private routeLayer: L.FeatureGroup | null = null;
  private animationInterval: number | null = null;
  
  isAnimating = false;
  routeAnalysis: RouteAnalysis | null = null;
  
  // Custom Icons
  private readonly icons = {
    start: L.divIcon({
      className: 'start-marker',
      html: `
        <div class="pulse-marker">
          <div class="pulse-dot"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    }),
    end: L.divIcon({
      className: 'end-marker',
      html: `
        <div class="end-dot"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    }),
    stop: L.divIcon({
      className: 'stop-marker',
      html: `
        <div class="stop-pin">
          <div class="pin-head"></div>
          <div class="pin-point"></div>
        </div>
      `,
      iconSize: [24, 32],
      iconAnchor: [12, 32]
    })
  };

  ngOnInit() {
    this.addCustomStyles();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
      if (this.geoJsonData) {
        this.loadGeoJSON(this.geoJsonData);
      }
    },100)
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private addCustomStyles() {
    if (document.getElementById('leaflet-custom-styles')) return;

    const style = document.createElement('style');
    style.id = 'leaflet-custom-styles';
    style.textContent = `
      .pulse-marker {
        position: relative;
        width: 20px;
        height: 20px;
      }
      
      .pulse-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        background: #22c55e;
        border: 2px solid white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
        }
      }
      
      .end-dot {
        width: 16px;
        height: 16px;
        background: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      }
      
      .stop-pin {
        position: relative;
        width: 24px;
        height: 32px;
      }
      
      .pin-head {
        position: absolute;
        top: 0;
        left: 50%;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        transform: translateX(-50%);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
      }
      
      .pin-point {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 12px solid #3b82f6;
        transform: translateX(-50%);
      }
      
      .animated-route {
        stroke-dasharray: 10, 10;
        animation: dash 2s linear infinite;
      }
      
      @keyframes dash {
        to {
          stroke-dashoffset: -20;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private initializeMap() {
    if (!this.mapElement) return;

    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: false,
      attributionControl: false
    }).setView([19.2, 73.1], 13);

    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: false
    }).addTo(this.map);
  }

  private analyzeRoute(geoJsonData: GeoJSONData): RouteAnalysis {
    const analysis: RouteAnalysis = {
      start: null,
      end: null,
      stops: [],
      route: null
    };

    geoJsonData.features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        analysis.route = feature;
      } else if (feature.geometry.type === 'Point') {
        const name = feature.properties.name.toLowerCase();
        if (name.includes('source')) {
          analysis.start = feature;
        } else if (name.includes('destination')) {
          analysis.end = feature;
        } else {
          analysis.stops.push(feature);
        }
      }
    });

    return analysis;
  }

  private loadGeoJSON(geoJsonData: GeoJSONData) {
    if (!this.map) return;

    // Clear existing layers
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }

    this.routeLayer = L.featureGroup().addTo(this.map);
    this.routeAnalysis = this.analyzeRoute(geoJsonData);

    // Add route line
    if (this.routeAnalysis.route) {
      this.addRouteWithAnimation(this.routeAnalysis.route);
    }

    // Add markers
    this.addMarkers();

    // Fit bounds
    setTimeout(() => this.fitBounds(), 100);
  }

  private addRouteWithAnimation(routeFeature: GeoJSONFeature) {
    if (!this.map || !this.routeLayer) return;

    const coordinates = routeFeature.geometry.coordinates as number[][];
    const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));

    // Create the full route (invisible initially)
    const fullRoute = L.polyline(latLngs, {
      color: '#8b5cf6',
      weight: 4,
      opacity: 0,
      smoothFactor: 1
    }).addTo(this.routeLayer);

    // Create animated route
    const animatedRoute = L.polyline([], {
      color: '#8b5cf6',
      weight: 4,
      opacity: 0.9,
      smoothFactor: 1,
      className: 'animated-route'
    }).addTo(this.routeLayer);

    // Animate the route drawing
    let currentIndex = 0;
    const animateRoute = () => {
      if (currentIndex < latLngs.length) {
        const currentPath = latLngs.slice(0, currentIndex + 1);
        animatedRoute.setLatLngs(currentPath);
        currentIndex++;
        setTimeout(animateRoute, 50);
      } else {
        // Show full route after animation
        fullRoute.setStyle({ opacity: 0.8 });
        this.routeLayer?.removeLayer(animatedRoute);
      }
    };

    animateRoute();
  }

  private addMarkers() {
    if (!this.map || !this.routeLayer || !this.routeAnalysis) return;

    // Add start marker
    if (this.routeAnalysis.start) {
      const coords = this.routeAnalysis.start.geometry.coordinates as number[];
      L.marker([coords[1], coords[0]], { 
        icon: this.icons.start,
        zIndexOffset: 1000
      })
      .bindPopup(`<strong>Start:</strong> ${this.routeAnalysis.start.properties.name}`)
      .addTo(this.routeLayer);
    }

    // Add end marker
    if (this.routeAnalysis.end) {
      const coords = this.routeAnalysis.end.geometry.coordinates as number[];
      L.marker([coords[1], coords[0]], { 
        icon: this.icons.end,
        zIndexOffset: 1000
      })
      .bindPopup(`<strong>End:</strong> ${this.routeAnalysis.end.properties.name}`)
      .addTo(this.routeLayer);
    }

    // Add stop markers
    this.routeAnalysis.stops.forEach((stop, index) => {
      const coords = stop.geometry.coordinates as number[];
      L.marker([coords[1], coords[0]], { 
        icon: this.icons.stop,
        zIndexOffset: 500
      })
      .bindPopup(`<strong>Stop ${index + 1}:</strong> ${stop.properties.name}`)
      .addTo(this.routeLayer!);
    });
  }

  fitBounds() {
    if (!this.map || !this.routeLayer) return;

    const group: any = this.routeLayer;
    console.log('Fitting bounds for group:', group);
    
    if (group.getLayers().length > 0) {
      console.log('Group has layers, fitting bounds...');
      
      const bounds = group.getBounds();
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }

  toggleAnimation() {
    this.isAnimating = !this.isAnimating;
    
    if (this.isAnimating) {
      this.startRouteAnimation();
    } else {
      this.stopRouteAnimation();
    }
  }

  private startRouteAnimation() {
    if (!this.geoJsonData) return;
    
    // Re-load with animation
    this.loadGeoJSON(this.geoJsonData);
  }

  private stopRouteAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  exportGeoJSON() {
    if (this.geoJsonData) {
      this.geoJsonExport.emit(this.geoJsonData);
    }
  }

  // Public method to load new GeoJSON data
  loadRoute(geoJsonData: GeoJSONData) {
    this.geoJsonData = geoJsonData;
    this.loadGeoJSON(geoJsonData);
  }
}
