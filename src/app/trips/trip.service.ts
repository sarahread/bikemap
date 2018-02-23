import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TripService {
  public trips: Trip[] = [];

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.refresh();
  }

  public async add(trip: Trip): Promise<any> {
    return await this.http.post('trips', trip).toPromise();
  }

  public async delete(trip: Trip): Promise<any> {
    return await this.http.delete(`trips/${trip._id}`).toPromise();
  }

  public async refresh(): Promise<Trip[]> {
    const trips = <Trip[]>(await this.http.get('trips').toPromise());
    
    this.trips.length = 0;
    [].push.apply(this.trips, trips);
    
    return this.trips;
  }
}
