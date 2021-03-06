import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Trip, NewTrip } from '../../interfaces';
import { TripService } from '../trip.service';
import { MapUtilsService } from '../map-utils.service';

// TODO: Better handling of weird querys with no / multiple results
// TODO: Properly capitalize querys

@Component({
  selector: 'trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.scss']
})
@Injectable()
export class TripAddComponent {
  trip: Trip = Object.assign({}, NewTrip);

  constructor(
    private http: HttpClient,
    private tripService: TripService,
    private mapUtils: MapUtilsService
  ) { }

  async add() {
    const startCoords = await this.mapUtils.getCoordsForQuery(this.trip.start.query);
    const endCoords = await this.mapUtils.getCoordsForQuery(this.trip.end.query);

    if (!startCoords || !endCoords) {
      // TODO: Handle error
      return;
    }

    const path = await this.mapUtils.getPath(startCoords, endCoords);

    if (!path) {
      // TODO: Handle error
      return;
    }

    const totalDistance = this.mapUtils.getPathDistance(path);
    
    Object.assign(this.trip.start, startCoords);
    Object.assign(this.trip.end, endCoords);
    this.trip.path = path;
    this.trip.totalDistance = totalDistance;

    this.tripService.add(this.trip)
      .then(() => {
        this.trip = Object.assign({}, NewTrip);
        this.tripService.refresh();
      })
      .catch(() => {
        // TODO
      });
  }

}
