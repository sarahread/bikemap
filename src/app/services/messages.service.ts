import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessagesService {
    private subject = new Subject<[string, any]>();

    send(target: string, message: any) {
        this.subject.next([
            target, message
        ]);
    }

    on(target: string, callback: Function): void {
        this.subject.asObservable().subscribe((value: [string, any]) => {
            if (value[0] == target) {
                callback(value[1]);
            }
        });
    }
}