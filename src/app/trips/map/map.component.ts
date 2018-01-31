import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, PolylineManager, AgmPolyline, Quer } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [GoogleMapsAPIWrapper, PolylineManager]
})
export class MapComponent implements OnInit {
    origin = { lng: 4.333, lat: -1.2222 };
    destination = { lng: 22.311, lat: -0.123 };

    directionsService;
    map;
    path;
    finishedPath;
    percent = 0.5;

    styles = [
      {
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ];

    constructor(private mapsApi: GoogleMapsAPIWrapper, private polylineManager: PolylineManager) {}

    ngOnInit() {}

    ngAfterViewInit() {}

    onMapReady(map) {
      this.map = map;

      this.directionsService = new google.maps.DirectionsService;
      const placesService = new google.maps.places.PlacesService(map);
      
      placesService.textSearch({
        query: 'Calgary'
      }, (response, status) => {
        if (status == 'OK') {
          this.origin = response[0].geometry.location;
          this.updateMap();
        } else {
          // TODO
        }
      });

      placesService.textSearch({
        query: 'Edmonton'
      }, (response, status) => {
        if (status == 'OK') {
          this.destination = response[0].geometry.location;
          this.updateMap();
        } else {
          // TODO
        }
      });
    }

    updateMap() {
      this.directionsService.route({
        origin: this.origin,
        destination: this.destination,
        waypoints: [],
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status == 'OK') {
          console.log('response', response);
          this.path = response.routes[0].overview_path;

          // Calculate total length of path

          const totalDistance = response.routes[0].legs.reduce((a, b) => {
            return a ? a.distance.value: 0 + b ? b.distance.value : 0;
          }, 0);

          console.log('distance', totalDistance);

          // Calculate point along path

          const targetDistance = totalDistance * this.percent;
          let distance = 0;

          for (let ii = 0; ii < this.path.length; ii++) {
            distance += google.maps.geometry.spherical.computeDistanceBetween(
              this.path[ii],
              this.path[ii + 1]
            );

            if (distance >= targetDistance) {
              console.log('hit distance', targetDistance, 'at', ii);
              this.finishedPath = this.path.slice(0, ii - 1);
              break;
            }
          }

        } else {
          console.log('failed', status, response);
        }
      });
    }

    
}
