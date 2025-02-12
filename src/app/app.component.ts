import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

interface Location {
  address: string;
  selectedTransport: string;
}

interface TransportOption {
  id: string;
  emoji: string;
}

interface CountryData {
  name: string;
  coordinates: [number, number];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App implements OnInit {
  tonnage: number = 1;
  freightUnit: string = 'tonnes';
  locations: Location[] = [
    { address: '', selectedTransport: 'plane' },
    { address: '', selectedTransport: 'plane' }
  ];
  transportOptions: TransportOption[] = [
    { id: 'truck', emoji: '🚛' },
    { id: 'ship', emoji: '🚢' },
    { id: 'plane', emoji: '✈️' },
    { id: 'train', emoji: '🚂' },
  ];

  countryData: CountryData[] = [
    { name: 'Afghanistan', coordinates: [34.5553, 69.2075] },
    { name: 'Albania', coordinates: [41.3275, 19.8187] },
    { name: 'Algeria', coordinates: [36.7538, 3.0588] },
    { name: 'Andorra', coordinates: [42.5063, 1.5218] },
    { name: 'Angola', coordinates: [-8.8147, 13.2302] },
    { name: 'Argentina', coordinates: [-34.6037, -58.3816] },
    { name: 'Armenia', coordinates: [40.1792, 44.4991] },
    { name: 'Australia', coordinates: [-35.2809, 149.1300] },
    { name: 'Austria', coordinates: [48.2082, 16.3738] },
    { name: 'Azerbaijan', coordinates: [40.4093, 49.8671] },
    { name: 'Belgium', coordinates: [50.8503, 4.3517] },
    { name: 'Brazil', coordinates: [-15.7975, -47.8919] },
    { name: 'Canada', coordinates: [45.4215, -75.6972] },
    { name: 'China', coordinates: [39.9042, 116.4074] },
    { name: 'France', coordinates: [48.8566, 2.3522] },
    { name: 'Germany', coordinates: [52.5200, 13.4050] },
    { name: 'India', coordinates: [28.6139, 77.2090] },
    { name: 'Italy', coordinates: [41.9028, 12.4964] },
    { name: 'Japan', coordinates: [35.6762, 139.6503] },
    { name: 'Mexico', coordinates: [19.4326, -99.1332] },
    { name: 'Netherlands', coordinates: [52.3676, 4.9041] },
    { name: 'New Zealand', coordinates: [-41.2866, 174.7756] },
    { name: 'Russia', coordinates: [55.7558, 37.6173] },
    { name: 'South Africa', coordinates: [-25.7461, 28.1881] },
    { name: 'Spain', coordinates: [40.4168, -3.7038] },
    { name: 'Sweden', coordinates: [59.3293, 18.0686] },
    { name: 'United Kingdom', coordinates: [51.5074, -0.1278] },
    { name: 'United States', coordinates: [38.8977, -77.0365] }
  ];

  countries: string[] = this.countryData.map(country => country.name);
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routeLine: L.Polyline | null = null;

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
      minZoom: 2
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  onLocationInput(locationIndex: number, value: string) {
    const matchedCountry = this.countryData.find(
      country => country.name.toLowerCase() === value.toLowerCase()
    );
    if (matchedCountry) {
      // Remove the old marker for this location if it exists
      if (this.markers[locationIndex]) {
        this.markers[locationIndex].remove();
      }
      
      const marker = L.marker(matchedCountry.coordinates, {
        icon: L.divIcon({
          html: '📍',
          className: 'marker-icon',
          iconSize: [60, 60],
          iconAnchor: [15, 15]
        })
      }).addTo(this.map);

      // Update or add the marker at the specific location index
      this.markers[locationIndex] = marker;

      // If this is a new location being added, center the map
      if (locationIndex === this.markers.length - 1) {
        this.map.setView(matchedCountry.coordinates, 4);
      }

      this.updateRouteLine();
    }
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker?.remove());
    this.markers = [];
    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }
  }

  private updateRouteLine() {
    // Remove existing route line
    if (this.routeLine) {
      this.routeLine.remove();
    }

    // Get all valid markers (markers that exist and have coordinates)
    const validMarkers = this.markers.filter(marker => marker);
    
    if (validMarkers.length >= 2) {
      // Create an array of coordinates from the markers
      const coordinates = validMarkers.map(marker => marker.getLatLng());
      
      // Create and add the polyline
      this.routeLine = L.polyline(coordinates, {
        color: '#007bff',
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);

      // Fit the map bounds to show all markers and the route
      this.map.fitBounds(this.routeLine.getBounds(), {
        padding: [50, 50]
      });
    }
  }

  selectTransport(locationIndex: number, transportId: string) {
    this.locations[locationIndex].selectedTransport = transportId;
  }

  addLocation() {
    this.locations.push({ address: '', selectedTransport: '' });
  }

  calculate() {
    console.log('Calculating emissions...');
    console.log('Tonnage:', this.tonnage);
    console.log('Unit:', this.freightUnit);
    console.log('Locations:', this.locations);
  }
}
