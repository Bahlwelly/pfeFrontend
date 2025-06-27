import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemandesService } from '../../../services/demandes.service';
import { Demande } from '../../../interfaces/demande';

@Component({
  selector: 'app-details-demande',
  standalone: true,
  imports: [],
  templateUrl: './details-demande.component.html',
  styleUrl: './details-demande.component.scss'
})
export class DetailsDemandeComponent {
  private route = inject(ActivatedRoute);
  private demandeService = inject(DemandesService);
  demande! : Demande;

  loadData (id : string) {
    console.log(id);
    
    this.demandeService.getDeamndeDetails(id).subscribe(data => {
      this.demande = data;
    });
  }

  ngOnInit () {
    const id =  this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);      
    }
  }
}
