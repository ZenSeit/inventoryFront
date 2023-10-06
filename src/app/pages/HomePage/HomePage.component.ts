import { Component, OnInit, Output } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { BranchesService } from 'src/app/services/branches/branches.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.css']
})
export class HomePageComponent implements OnInit {

  @Output() branches:Branch[] = [];

  socketManager?:WebSocketSubject<Branch>;

  constructor(private branchService:BranchesService,private socket:SocketService) { }

  ngOnInit() {
    this.branchService.getBranches().subscribe((data)=>{
      this.branches = data;
      console.log(data);
    } );

    this.connectToMainSpace()
  }

  connectToMainSpace(){
    this.socketManager = this.socket.connetToGeneralSpace()
    this.socketManager.subscribe((message) => {
      this.addBranchToView(message)
      console.log(message);
    })
  }

  addBranchToView(branch:Branch){
    this.branches.unshift(branch);
  }

}
