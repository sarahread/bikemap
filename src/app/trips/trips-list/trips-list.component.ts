import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip.service';
import { Trip } from '../../interfaces';

@Component({
  selector: 'trips-list',
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
})
export class TripsListComponent implements OnInit {

  constructor(
    private tripService: TripService
  ) { }
  
  async ngOnInit() {
  }

  private async delete(trip: Trip) {
    if (confirm('Are you sure?')) {
      await this.tripService.delete(trip);
      this.tripService.refresh();
    }
  }
}
