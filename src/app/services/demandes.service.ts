import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Demande } from '../interfaces/demande';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemandesService {
  private demandesUrl = 'http://localhost:8000/api/afficher/demande';
  private http = inject(HttpClient);

  getDeamndes () : Observable<Demande[]> {
    return this.http.get<Demande[]>(this.demandesUrl);
  }

  getDeamndeDetails (id : string) : Observable<Demande> {
    return this.http.get<Demande>(`${this.demandesUrl}/${id}`);
  }
}
