import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injectable } from '@angular/core';
import { Trip } from '../../interfaces';
import { TripService } from '../trip.service';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
@Injectable()
export class AddComponent implements OnInit {
  trip: Trip = {
    start: {
      query: '',
      lat: null,
      lng: null
    },
    end: {
      query: '',
      lat: null,
      lng: null
    },
    path: null,
    totalDistance: 0
  };

  constructor(
    private http: HttpClient,
    private tripService: TripService,
    private mapsService: MapsService
  ) { }

  ngOnInit() {
  }

  async add() {
    this.tripService.add(this.trip)
      .then(() => {})
      .catch(() => {});
  }

}
