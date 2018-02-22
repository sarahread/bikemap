import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { LatLngQuery } from '../interfaces';

declare var google: any;

@Injectable()
export class MapsService {
    public directionsService;
    public placesService;

    constructor(private loader: MapsAPILoader) {
        loader.load().then(() => {
            this.directionsService = new google.maps.DirectionsService;
            this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
        });
    }

    public async getCoordsForQuery(query: string): Promise<LatLngQuery> {
        return new Promise<LatLngQuery>((resolve, reject) => {
            this.placesService.textSearch({ query }, (response, status) => {
                if (status == 'OK' && response.length >= 1) {
                    resolve({
                        query,
                        lat: response[0].geometry.location.lat(),
                        lng: response[0].geometry.location.lng()
                    });
                } else {
                    reject();
                }
            });
        });
    }

    public async getPath(start: LatLngQuery, end: LatLngQuery): Promise<any> {
        return await new Promise<any>((resolve, reject) => {
            this.directionsService.route({
                origin: start,
                destination: end,
                waypoints: [],
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status == 'OK') {
                    resolve(response.routes[0].overview_path.map(p => {
                        return {
                            lat: p.lat(),
                            lng: p.lng()
                        };
                    }));
                } else {
                    reject();
                }
            });
        });
    }

    public getPathDistance(path: any): number {
        let distance = 0;

        for (let ii = 1; ii < path.length; ii++) {
            const a = new google.maps.LatLng(path[ii - 1]);
            const b = new google.maps.LatLng(path[ii]);

            distance += this.getDistanceBetween(a, b);
        }

        return distance;
    }

    public getDistanceBetween(start: LatLngQuery, end: LatLngQuery) {
        return google.maps.geometry.spherical.computeDistanceBetween(
            start,
            end
        );
    }

    public sumProgress(progress: number[]): number {
        return progress.reduce((a, b) => a + b ) * 1000 || 0; // Convert to km
    }
}
