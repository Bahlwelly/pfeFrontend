import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plaintes } from '../../interfaces/plaintes';

@Injectable({
  providedIn: 'root'
})
export class PlaintesService {
  private plaintesUrl : string = 'http://localhost:8000/api/afficher/plainte';
  private detailsPlaintesUrl : string = 'http://localhost:8000/api/afficher/detailPlainte';
  private http = inject(HttpClient)

    getPlaintes () : Observable<Plaintes []> {
      return this.http.get<Plaintes []>(`${this.plaintesUrl}`);
    }

    getPlainteDetails (id : string) : Observable <Plaintes> {
      return this.http.get<Plaintes>(`${this.detailsPlaintesUrl}/${id}`);
    }
}
