import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginResponce } from '../../interfaces/login-responce';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);

  private loginUrl = 'http://localhost:8000/api/loginAdmin'
  private addAdminUrl = 'http://localhost:8000/api/ajouterAdmin'

  login(password : string, email : string) {
    return this.http.post<LoginResponce>(this.loginUrl, {password, email});
  }


  addAdmin (email : string, password : string) {
    return this.http.post(this.addAdminUrl, {password, email});
  }
}
