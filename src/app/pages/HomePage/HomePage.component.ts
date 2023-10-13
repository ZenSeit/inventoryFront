import { Component, OnInit, Output } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { BranchesService } from 'src/app/services/branches/branches.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewBranch } from 'src/app/models/newBranch';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.css']
})
export class HomePageComponent implements OnInit {

  @Output() branches:Branch[] = [];
  branchForm!: FormGroup;

  socketManager?:WebSocketSubject<Branch>;

  constructor(private branchService:BranchesService,private socket:SocketService,private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.branchService.getBranches().subscribe((data)=>{
      this.branches = data;
      console.log(data);
    } );

    this.connectToMainSpace()

    this.branchForm = this.formBuilder.group({
      name: ['',[Validators.required,Validators.minLength(3)]],
      city: ['',[Validators.required,Validators.minLength(3)]],
      country: ['',[Validators.required,Validators.minLength(3)]]
    });
  }

  createBranch(newBranch:any){
    let branchTosend:NewBranch = {
      name:newBranch.name,
      location:{
        city:newBranch.city,
        country:newBranch.country
      }
    
    }
    this.branchService.createBranch(branchTosend).subscribe((data)=>{
      console.log(data);
    })
  }

  connectToMainSpace(){
    this.socketManager = this.socket.connetToGeneralSpace()
    this.socketManager.subscribe((message) => {
      this.addBranchToView(message)
      console.log(message);
    })
  }

  addBranchToView(message:any){
    const branch:Branch = {
      id:message.aggregateRootId,
      name:message.name,
      location:message.location
    }
    this.branches.unshift(branch);
  }

}
