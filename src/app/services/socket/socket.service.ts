import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject  } from 'rxjs/webSocket'
import { Branch } from 'src/app/models/branch';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

constructor() { }

connetToGeneralSpace():WebSocketSubject<Branch>{
  return webSocket('WS://localhost:8082/retrieve/mainSpace');
}

connetToSpecificSpace(branch:string):WebSocketSubject<any>{
  return webSocket(`WS://localhost:8082/retrieve/${branch}`);
}

}
