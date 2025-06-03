import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { Demande } from '../../interfaces/demande';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private getUsersUrl = "http://localhost:8000/api/afficher/utilisateur";
  private signalUrl = "http://localhost:8000/api/signal"
  private nommerUrl = "http://localhost:8000/api/transformer"
  private demandeUrl = "http://localhost:8000/api/afficher/demande"

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

  swithchRole (id : string, newRole : 'CHEF' | 'CITOYEN', newCommune : string) : Observable<User> {
    return this.http.post<User>(`${this.nommerUrl}/${id}`, {role : newRole, commune : newCommune});
  } 

  getDemande () :  Observable<Demande> {
    return this.http.get<Demande>(this.demandeUrl);
  }
}
