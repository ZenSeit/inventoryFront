import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Branch } from 'src/app/models/branch';
import { NewBranch } from 'src/app/models/newBranch';
import { WindowEnv } from 'src/app/models/windowEnv';


@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  api_service: string = `http://${window._env.SERVICE_URI}`;
  api_storage: string = `http://${window._env.STORAGE_URI}`;

constructor(private http:HttpClient) { }

getBranches(){
  return this.http.get<Branch[]>(`${this.api_storage}/api/v1/branch`);
}

getBranchById(id:string){
  return this.http.get<Branch>(`${this.api_storage}/api/v1/branch/`+id);
}

createBranch(branch:NewBranch){
  return this.http.post(`${this.api_service}/api/v1/branch/register`,branch);
}


}
