import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TripService {
  private tripsChangedSubject = new Subject<Trip[]>();
  public tripsChanged = this.tripsChangedSubject.asObservable();

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
    this.trips = trips;
    this.tripsChangedSubject.next(trips);

    return this.trips;
  }

  public async log(trip: Trip, distance: number): Promise<any> {
    return await this.http.post(`trips/${trip._id}/log/${distance}`, null).toPromise();
  }
}
