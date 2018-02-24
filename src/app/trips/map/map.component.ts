import { environment } from '../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, PolylineManager, AgmPolyline } from '@agm/core';
import { Trip } from '../../interfaces';
import { MapUtilsService } from '../map-utils.service';
import { TripService } from '../trip.service';
import { MessagesService } from '../../services/messages.service';

declare const google: any;

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [GoogleMapsAPIWrapper, PolylineManager]
})
export class MapComponent implements OnInit {
    // @Input() trips: Trip[] = [
    //   {
    //     start: {
    //       query: `Land's End, UK`,
    //       lat: null,
    //       lng: null
    //     },
    //     end: {
    //       query: `John 'o Groats, UK`,
    //       lat: null,
    //       lng: null
    //     },
    //     progress: [10, 10, 10, 11.52, 10.36, 11.27, 12.5, 12.57, 12.26, 10.7, 15.14, 18.79, 16.17, 14.84, 16.46, 11.32, 16.01, 16.73, 16.15],
    //   } 
    // ];
    tripService = this._tripService;
    mapReady: boolean = false;
    finishedPaths = [];
    map: any;
    bounds: any;

    // TODO: Move styles to separate file

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

    constructor(
      private mapsApi: GoogleMapsAPIWrapper,
      private polylineManager: PolylineManager,
      private mapUtils: MapUtilsService,
      private _tripService: TripService,
      private messagesService: MessagesService
    ) {
      this.tripService.tripsChanged.subscribe(trips => {
        if (this.mapReady) {
          this.updateMap();
        }
      });

      this.messagesService.on('map:zoom', trip => {
        this.zoomToTrip(trip);
      });
    }

    ngOnInit() {}

    ngAfterViewInit() {}

    async onMapReady(map) {
      this.map = map;
      this.mapReady = true;

      this.updateMap();
    }

    private async updateMap() {
      await this.mapUtils.waitForLoad();

      this.tripService.trips.forEach((trip, index) => {
        const progress = this.mapUtils.sumProgress(trip.progress);
        const totalDistance = this.mapUtils.getPathDistance(trip.path);
        const targetDistance = progress / totalDistance * totalDistance;
        
        let distance = 0;

        // TODO: Allow being between path points

        for (let ii = 1; ii < trip.path.length - 1; ii++) {
          distance += google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(trip.path[ii]),
            new google.maps.LatLng(trip.path[ii + 1])
          );

          if (distance >= targetDistance) {
            this.finishedPaths[index] = trip.path.slice(0, Math.max(2, ii - 1));
            break;
          }
        }
      });

      this.zoomToFit();
    }

    private zoomToFit() {
      this.bounds = new google.maps.LatLngBounds();
      this.tripService.trips.forEach(trip => {
        trip.path.forEach(p => {
          this.bounds.extend(new google.maps.LatLng(p.lat, p.lng));
        });
      });
    }

    private zoomToTrip(trip: Trip) {
      this.bounds = new google.maps.LatLngBounds();
      trip.path.forEach(p => {
        this.bounds.extend(new google.maps.LatLng(p.lat, p.lng));
      });
    }
}
