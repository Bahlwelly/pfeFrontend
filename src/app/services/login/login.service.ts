import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginResponce } from '../../interfaces/login-responce';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);

  private loginUrl = 'http://localhost:8000/api/loginAdmin'

  login(password : string) {
    return this.http.post<LoginResponce>(this.loginUrl, {password});
  }

}
