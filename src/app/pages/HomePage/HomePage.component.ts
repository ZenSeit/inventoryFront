import { Component, OnInit, Output } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { BranchesService } from 'src/app/services/branches/branches.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewBranch } from 'src/app/models/newBranch';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'src/app/services/token/token.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-HomePage',
  templateUrl: './HomePage.component.html',
  styleUrls: ['./HomePage.component.css'],
})
export class HomePageComponent implements OnInit {
  branches: Branch[] = [];
  branchForm!: FormGroup;
  userForm!: FormGroup;

  socketManager?: WebSocketSubject<Branch>;

  constructor(
    private branchService: BranchesService,
    private socket: SocketService,
    private formBuilder: FormBuilder,
    private authJwt: JwtHelperService,
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    //this.setTokenLocal();
    this.getRole();

    this.branchService.getBranches().subscribe((data) => {
      this.branches = data;
      console.log(data);
    });

    this.connectToMainSpace();

    this.branchForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required, Validators.minLength(3)]],
      branchId: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  createBranch(newBranch: any) {
    let branchTosend: NewBranch = {
      name: newBranch.name,
      location: {
        city: newBranch.city,
        country: newBranch.country,
      },
    };
    this.branchService.createBranch(branchTosend).subscribe((data) => {
      this.toastr.success("Branch created successfully","Success")
    });

  }

  connectToMainSpace() {
    this.socketManager = this.socket.connetToGeneralSpace();
    this.socketManager.subscribe((message) => {
      this.addBranchToView(message);
      console.log(message);
    });
  }

  addBranchToView(message: any) {
    const branch: Branch = {
      id: message.aggregateRootId,
      name: message.name,
      location: message.location,
    };
    this.branches.unshift(branch);
  }

  getRole() {
    this.tokenService.setToken();
    const token = '';
    this.tokenService.token$.subscribe((data) => {
      if (data) {
        if (this.authJwt.decodeToken(data).roles !== 'SUPER') {
          this.router.navigate([
            '/branch/' + this.authJwt.decodeToken(data).branchId,
          ]);
        }
      }
    });
  }

  createUser(newUser: User) {
    //console.log(newUser);
    if (newUser.role === 'SUPER') {
      newUser.branchId = null;
      this.userService.createSuperAdmin(newUser).subscribe((data) => {
        console.log(data);
        this.toastr.success(`User ${newUser.name} created successfully in branch`,"Success")
      });
    } else {
      this.userService.createUser(newUser).subscribe((data) => {
        console.log(data);
        this.toastr.success(`User ${newUser.name} created successfully in branch`,"Success")
      });
    }
  }
}
