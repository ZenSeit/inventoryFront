import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Branch } from 'src/app/models/branch';
import { NewBranch } from 'src/app/models/newBranch';


@Injectable({
  providedIn: 'root'
})
export class BranchesService {

constructor(private http:HttpClient) { }

getBranches(){
  return this.http.get<Branch[]>("http://localhost:8081/api/v1/branch");
}

getBranchById(id:string){
  return this.http.get<Branch>("http://localhost:8081/api/v1/branch/"+id);
}

createBranch(branch:NewBranch){
  return this.http.post("http://localhost:8080/api/v1/branch/register",branch);
}


}
