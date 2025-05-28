import { Component, inject } from '@angular/core';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { Plaintes } from '../../../interfaces/plaintes';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/usersService/user.service';
import { ActivatedRoute } from '@angular/router';

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


  loadData (id : string) {
    this.plainteService.getPlainteDetails(id).subscribe((data) => {
      this.plainte = data;
      this.usersService.getUserDetails(this.plainte.user_id).subscribe((data) => {
        this.user = data;
        console.log(`the plainte ${this.plainte.id} and the user ${this.user.id} are loaded`);
      });
    });
  }


  private route = inject(ActivatedRoute);
  ngOnInit () {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.loadData(id);
    });
  }
}
