import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Branch } from 'src/app/models/branch';


@Injectable({
  providedIn: 'root'
})
export class BranchesService {

constructor(private http:HttpClient) { }

getBranches(){
  return this.http.get<Branch[]>("http://localhost:8081/api/v1/branch");
}


}
