import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { BranchesService } from 'src/app/services/branches/branches.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit {

  @Input() branches:Branch[] = [];

  constructor(private routerPath: Router,) { }

  ngOnInit() {
  }

  openBranch(branchId:string){
    this.routerPath.navigate(['/branch/'+branchId]);
  }

}
