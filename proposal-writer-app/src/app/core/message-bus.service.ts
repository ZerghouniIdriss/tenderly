import { Injectable, isDevMode } from '@angular/core'; // Imported isDevMode
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface Message {
  type: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageBusService {
  private message$: Subject<Message> = new Subject<Message>();

  constructor() { }

  /**
   * Publishes a message to the message bus.
   * @param type The type of the message.
   * @param payload Optional payload.
   */
  publish(type: string, payload?: any): void {
    if (isDevMode()) {
      console.log(`[MessageBus] Publishing: ${type}`, payload);
    }
    this.message$.next({ type, payload });
  }

  /**
   * Subscribes to messages of a specific type.
   * @param type The type of message to listen for.
   * @returns An Observable that emits the payload of messages of the specified type.
   */
  on<T>(type: string): Observable<T> {
    return this.message$.pipe(
      filter(message => message.type === type),
      map(message => message.payload as T)
    );
  }

  /**
  * Subscribes to all messages.
  * @returns An Observable that emits all messages.
  */
  onAny(): Observable<Message> {
    return this.message$.asObservable();
  }
}
