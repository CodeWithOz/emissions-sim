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
    { address: '', selectedTransport: '' },
    { address: '', selectedTransport: '' }
  ];
  transportOptions: TransportOption[] = [
    { id: 'truck', emoji: '🚛' },
    { id: 'ship', emoji: '🚢' },
    { id: 'plane', emoji: '✈️' },
    { id: 'train', emoji: '🚂' },
  ];

  private map!: L.Map;

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

  selectTransport(locationIndex: number, transportId: string) {
    this.locations[locationIndex].selectedTransport = transportId;
  }

  addLocation() {
    this.locations.push({ address: '', selectedTransport: '' });
  }

  calculate() {
    // Implement calculation logic
    console.log('Calculating emissions...');
    console.log('Tonnage:', this.tonnage);
    console.log('Unit:', this.freightUnit);
    console.log('Locations:', this.locations);
  }
}
