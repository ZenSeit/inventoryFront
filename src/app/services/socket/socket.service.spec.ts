import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Branch } from 'src/app/models/branch';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService],
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to general space', () => {
    const webSocketSubject: WebSocketSubject<Branch> = service.connetToGeneralSpace();

    expect(webSocketSubject).toBeTruthy();
    expect(webSocketSubject instanceof WebSocketSubject).toBe(true);
  });

  it('should connect to specific space', () => {
    const branchId = 'testBranch';
    const webSocketSubject: WebSocketSubject<any> = service.connetToSpecificSpace(branchId);

    expect(webSocketSubject).toBeTruthy();
    expect(webSocketSubject instanceof WebSocketSubject).toBe(true);
  });
});

