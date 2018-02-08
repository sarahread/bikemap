import { environment } from '../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, PolylineManager, AgmPolyline } from '@agm/core';
import { Trip } from '../../interfaces';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [GoogleMapsAPIWrapper, PolylineManager]
})
export class MapComponent implements OnInit {
    @Input() trips: Trip[] = [];
    // routes: Route[] = [
    //   {
    //     start: {
    //       query: `Land's End, UK`
    //     },
    //     end: {
    //       query: `John 'o Groats, UK`
    //     },
    //     distanceTravelled: [10, 10, 10, 11.52, 10.36].reduce((a, b) => a + b ) * 1000 || 0 // Convert to km
    //   } 
    // ];

    directionsService;
    placesService;
    map;
    bounds;

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

    async onMapReady(map) {
      this.map = map;

      this.directionsService = new google.maps.DirectionsService;
      this.placesService = new google.maps.places.PlacesService(map);
      
      // Fetch lat / lng / path for routes

      for (let ii = 0; ii < this.trips.length; ii++) {
        const trip = this.trips[ii];
        const start = await this.searchLocation(trip.start.query);
        const end = await this.searchLocation(trip.end.query);

        Object.assign(trip.start, start);
        Object.assign(trip.end, end);

        [trip.path, trip.totalDistance] = await new Promise<any>(resolve => {
          this.directionsService.route({
            start,
            end,
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
          }, (response, status) => {
            if (status == 'OK') {
              const path = response.routes[0].overview_path;

              // Calculate total length of path

              const totalDistance = response.routes[0].legs.reduce((a, b) => {
                return a ? a.distance.value: 0 + b ? b.distance.value : 0;
              }, 0);

              resolve([path, totalDistance]);
            } else {
              console.log('error searching route');
            }
          });
        });
      }

      this.updateMap();
    }

    async searchLocation(query: string): Promise<any>{
      return new Promise(resolve => {
          this.placesService.textSearch({ query }, (response, status) => {
            if (status == 'OK') {
              resolve(response[0].geometry.location);
            } else {
              console.log('error searching location:', query);
            }
          });
        });
    }

    updateMap() {
      this.trips.forEach(trip => {
        const targetDistance = trip.distanceTravelled / trip.totalDistance * trip.totalDistance;
        console.log(trip.totalDistance, trip.distanceTravelled, targetDistance)
        let distance = 0;

        // TODO: Allow being between path points

        for (let ii = 1; ii < trip.path.length - 1; ii++) {
          distance += google.maps.geometry.spherical.computeDistanceBetween(
            trip.path[ii],
            trip.path[ii + 1]
          );

          if (distance >= targetDistance) {
            trip.finishedPath = trip.path.slice(0, Math.max(2, ii - 1));
            break;
          }
        }
      });

      this.zoomToFit();
    }

    zoomToFit() {
      this.bounds = new google.maps.LatLngBounds();
      this.trips.forEach(trip => {
        trip.path.forEach(p => {
          this.bounds.extend(new google.maps.LatLng(p.lat(), p.lng()));
        });
      });
      console.log('bounds', this.bounds);
    }
}
