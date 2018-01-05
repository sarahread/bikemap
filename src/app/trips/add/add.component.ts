import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  name: string;
  totalDistance: number;
  result: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async add() {

    this.result = await this.http.post('trips', {
      name: this.name,
      totalDistance: this.totalDistance
    }).toPromise();
  }

}
