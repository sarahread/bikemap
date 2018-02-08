import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TripService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
    ) {}

  public async add(trip: Trip): Promise<any> {
    return await this.http.post('trips', trip).toPromise();
  }

  public async addDistance(trip: Trip, distance: number) {
    return await this.http.patch(`trips/${trip.id}`, {distance})
  }

  public async getAll() {
    return await this.http.get('trips');
  }
}
