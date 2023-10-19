import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject  } from 'rxjs/webSocket'
import { Branch } from 'src/app/models/branch';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  api_socket: string = `WS://${window._env.SOCKET_URI}`;

  // api_socket: string = `WS://localhost:8082`;

constructor() { }

connetToGeneralSpace():WebSocketSubject<Branch>{
  return webSocket(`${this.api_socket}/retrieve/mainSpace`);
}

connetToSpecificSpace(branch:string):WebSocketSubject<any>{
  return webSocket(`${this.api_socket}/retrieve/${branch}`);
}

}
