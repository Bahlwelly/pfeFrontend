import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private getUsersUrl = "http://localhost:8000/api/afficher/utilisateur";
  private signalUrl = "http://localhost:8000/api/signal"

  // A METHODE TO GET ALL THE USERS ====>
  getUsers () : Observable<User[]> {
    return this.http.get<User[]>(this.getUsersUrl);
  }

  getUserDetails (id : string) : Observable<User> {
    return this.http.get<User>(`${this.getUsersUrl}/${id}`);
  }


  signal (id : string, currentCount : number) : Observable<User> {
    const updatedCount = currentCount + 1;
    return this.http.put<User>(`${this.signalUrl}/${id}`, {signal: updatedCount});
  }

  restore (id : string) : Observable<User> {
    return this.http.put<User>(`${this.signalUrl}/${id}`, {signal: 0});
  }


  blockUser (user : User) : Observable <User> {
    return this.http.post<User>(`${this.getUsersUrl}`, user);
  }

  swithchRole (id : string, newRole : 'CHEF' | 'CITOYEN') : Observable<User> {
    return this.http.patch<User>(`${this.getUsersUrl}/${id}`, {role : newRole});
  } 
}
