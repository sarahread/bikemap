import { Component } from '@angular/core';
import { TripService } from '../trip.service';
import { Trip } from '../../interfaces';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'trips-list',
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
})
export class TripsListComponent {
  private currentTrip: Trip;
  private distances: number[] = [];

  constructor(
    private tripService: TripService,
    private messagesService: MessagesService
  ) { }
  
  private async delete(trip: Trip) {
    if (confirm('Are you sure?')) {
      await this.tripService.delete(trip);
      this.tripService.refresh();
    }
  }

  private selectTrip(trip: Trip) {
    this.messagesService.send('map:zoom', trip);
    this.currentTrip = trip;
  }

  private log(trip: Trip, index: number) {
    this.tripService.log(trip, this.distances[index]);
    trip.progress.push(this.distances[index]);
    delete this.distances[index];
  }
}
