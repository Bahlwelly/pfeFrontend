import { Component, inject } from '@angular/core';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { Plaintes } from '../../../interfaces/plaintes';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/usersService/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plainte-details',
  standalone: true,
  imports: [],
  templateUrl: './plainte-details.component.html',
  styleUrl: './plainte-details.component.scss'
})
export class PlainteDetailsComponent {
  private plainteService = inject(PlaintesService);
  private usersService = inject(UserService);
  plainte! : Plaintes;
  user! : User;
  chef! : User;
  dateCreation! : string;
  dateInspection! : string;

  loadData (id : string) {
    this.plainteService.getPlainteDetails(id).subscribe((data) => {
      this.plainte = data;
      this.dateCreation = new Date(data.created_at).toISOString();
      this.dateInspection = new Date(data.updated_at).toISOString();
      
      this.usersService.getUserDetails(this.plainte.user_id).subscribe((data) => {
        this.user = data;
        console.log(`the plainte ${this.plainte.id} and the user ${this.user.id} are loaded`);
      });
      this.usersService.getUserDetails(this.plainte.chef_id).subscribe(data => {
        this.chef = data;
      });
    });
  }

  translateDetails (details : string) {
    switch (details) {
      case 'منتج منتهي الصلاحية' :
        return 'Produit périmé.';

      case 'منتج ملوث' :
        return 'Produit contaminé.';

      case 'منتج فاسد' :
        return 'Produit avarié.';

      case 'تغليف تالف' :
        return "Emballage endommagé.";

      case 'وجود أجسام غريبة' : 
        return "Présence de corps étrangers.";

      case 'رائحة أو طعم غير طبيعي' :
        return "Odeur ou goût anormal.";

      default : 
        return details;
    }
  }

  currentPage : string = 'plaintes';

  private route = inject(ActivatedRoute);
  ngOnInit () {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.loadData(id);
    });

    this.currentPage = localStorage.getItem('currentPage')!;
  }

  private router = inject (Router);
  backwards (id? : string) {
    if (this.currentPage === 'plaintes') {
      this.router.navigate(['/home/plaintes']);
    }
    else if (this.currentPage === 'users_list' || this.currentPage === 'chefs') {
      this.router.navigate(['/home/user/details', id]);
    }
  }
}
