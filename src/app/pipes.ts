import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDistance' })
export class FormatDistancePipe implements PipeTransform {
  transform(distance: number) {
    return (distance / 1000).toFixed(1);
  }
}