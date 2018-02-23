import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDistance' })
export class FormatDistancePipe implements PipeTransform {
  transform(distance: number) {
    return (distance / 1000).toFixed(1);
  }
}

@Pipe({ name: 'sumProgress' })
export class SumProgressPipe implements PipeTransform {
  transform(progress: number[]) {

    // FIXME: Duplicative of function in MapUtils

    return progress.reduce((a, b) => { return a + b; }, 0) * 1000 || 0; // Convert to km
  } 
}
