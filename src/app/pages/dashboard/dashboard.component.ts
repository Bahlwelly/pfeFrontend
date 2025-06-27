import { Component, inject } from '@angular/core';
import { UserService } from '../../services/usersService/user.service';
import { User } from '../../interfaces/user';
import { PlaintesService } from '../../services/plaintesService/plaintes.service';
import { Plaintes } from '../../interfaces/plaintes';
import { forkJoin } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private usersService = inject(UserService);
  users : User[] = [];
  chefs : User[] = [];
  usersNumber : number = 0;
  blockedUsersNumber : number = 0;
  chefsNumber : number = 0;

  private plaintesService = inject(PlaintesService);
  plaintes : Plaintes[] = [];
  plaintesNumber : number = 0;
  plaintesNonInspectNumber : number = 0;
  invalidPlaintesNumber : number = 0;
  enCoursPlaintesNumber : number = 0;

  loadData () {
      forkJoin ({
        plaintes : this.plaintesService.getPlaintes(),
        users : this.usersService.getUsers()
      }).subscribe( ({ plaintes, users }) => {
        this.users = users.filter(user => user.role === 'CITOYEN');
        this.chefs = users.filter(user => user.role === 'CHEF');
        this.usersNumber = users.filter(user => user.role == 'CITOYEN' && user.blocquee !== 'blocquee').length;
        this.blockedUsersNumber = users.filter(user => user.blocquee == 'blocquee').length;
        this.chefsNumber = users.filter(user => user.role == 'CHEF').length;
        this.setPercentages(this.users, 'user');

        this.plaintes = plaintes;
        this.plaintesNumber = plaintes.filter(pl => pl.etat.toLowerCase() === 'valid').length;
        this.plaintesNonInspectNumber = plaintes.filter (pl => pl.etat.toLowerCase() === 'en attente').length;
        this.invalidPlaintesNumber = plaintes.filter (pl => pl.etat.toLowerCase() === 'invalid').length;
        this.enCoursPlaintesNumber = plaintes.filter (pl => pl.etat.toLowerCase() === 'en cours').length;

        this.setPercentages(this.plaintes, 'plainte');
      })
  }


  chefsCommune : User [] = [];
  communes = ["Dar Naim", "Teyarett", "Toujounine", "Ksar", "Tevragh Zeina", "Sebkha", "Arafat", "El Mina", "Riad"];
  selectedCommune! : string;
  getChefsParCommune (event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCommune = value;
    console.log(this.selectedCommune);
    
    this.chefsCommune = this.chefs.filter(chef => chef.commune === this.selectedCommune);
    this.chefsNumber = this.chefsCommune.length;
  }
  
  
  validsPlPercent : string = '';
  invalidsPlPercent : string = '';
  enCoursPlPercent : string = '';
  enAttentePlPercent : string = '';

  plaintesCommune : Plaintes [] = [];

  getPlaintesParCommune (event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCommune = value;
    if (this.selectedCommune === 'tous') {
      this.plaintesCommune = this.plaintes;
      this.plaintesNumber = this.plaintesCommune.filter(pl => pl.etat.toLowerCase() === 'valid').length;
      this.plaintesNonInspectNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'en attente').length;
      this.invalidPlaintesNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'invalid').length;
      this.enCoursPlaintesNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'en cours').length;
      console.log(this.plaintesCommune);
      console.log(this.plaintesNumber);
      console.log(this.plaintesNonInspectNumber);
      console.log(this.invalidPlaintesNumber);
      console.log(this.enCoursPlaintesNumber);
      this.setPercentages(this.plaintesCommune,'plainte');
      return;
    }
    
    this.plaintesCommune = this.plaintes.filter(pl => pl.commune.toLowerCase() === this.selectedCommune.toLowerCase());
    console.log(this.plaintesCommune);
    
    this.plaintesNumber = this.plaintesCommune.filter(pl => pl.etat.toLowerCase() === 'valid').length;
    this.plaintesNonInspectNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'en attente').length;
    this.invalidPlaintesNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'invalid').length;
    this.enCoursPlaintesNumber = this.plaintesCommune.filter (pl => pl.etat.toLowerCase() === 'en cours').length;
    
    this.setPercentages(this.plaintesCommune, 'plainte');
  }

  usersPercent : string = '';
  blockedUsersPercent : string = '';
  chefsPercent : string = '';

  setPercentages (data : Plaintes[] | User[], type : 'user' | 'plainte') {
    if (type === 'plainte') {
      let validPercent = (this.plaintesNumber * 100 / data.length);
      let invalidPercent = (this.invalidPlaintesNumber * 100 / data.length);
      let enCoursPercent = (this.enCoursPlaintesNumber * 100 / data.length);
      let enAttentePercent = (this.plaintesNonInspectNumber * 100 / data.length);

      this.validsPlPercent = `${validPercent % 1 !== 0 ? validPercent.toFixed(2) : validPercent}%`
      this.invalidsPlPercent = `${invalidPercent % 1 !== 0 ? invalidPercent.toFixed(2) : invalidPercent}%`
      this.enCoursPlPercent = `${enCoursPercent % 1 !== 0 ? enCoursPercent.toFixed(2) : enCoursPercent}%`
      this.enAttentePlPercent = `${enAttentePercent % 1 !== 0 ? enAttentePercent.toFixed(2) : enAttentePercent}%`  
    }
    else if (type === 'user') {
      let usersPerc = (this.usersNumber * 100 / data.length);
      let blockedUsersPerc = (this.blockedUsersNumber * 100 / data.length);

      this.usersPercent = `${usersPerc % 1 !== 0 ? usersPerc.toFixed(2) : usersPerc}%`
      this.blockedUsersPercent = `${blockedUsersPerc % 1 !== 0 ? blockedUsersPerc.toFixed(2) : blockedUsersPerc}%`
    }
    
  }

  ngOnInit () {
    this.loadData()
  }

  // =========THE PAGES LOGIC==================>
  selectedPage : string = 'users';

  swichPages (page : string) {
    this.selectedPage = page;
  }


  private router = inject(Router);
  showPlaintes (type : string) {
    this.router.navigate(['/home/plaintes'], {queryParams : {type}});
  }
}
