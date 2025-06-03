import { Component, inject } from '@angular/core';
import { Plaintes } from '../../../interfaces/plaintes';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { UserService } from '../../../services/usersService/user.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-plaintes-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './plaintes-list.component.html',
  styleUrl: './plaintes-list.component.scss'
})
export class PlaintesListComponent {
  plaintes : Plaintes[] = [];
  plaintesNonExam : Plaintes[] = [];
  plaintesInvalids : Plaintes[] = [];
  users : User[] = [];
  plaintesService = inject(PlaintesService);
  usersService = inject(UserService);
  
  loadData () {
    forkJoin({
      plaintes : this.plaintesService.getPlaintes(),
      users : this.usersService.getUsers()
    }).subscribe(({ plaintes, users }) => {
      this.users = users;
      this.plaintes = plaintes;
      this.filterData()
    });
  }

  filterData () {
    this.plaintesInvalids = this.plaintes.filter(pl => pl.valid !== 'valid');
    this.plaintesNonExam = this.plaintes.filter(pl => pl.examiner !== 'examinee');
    this.plaintes = this.plaintes.filter(pl => pl.examiner === 'examinee' && pl.valid === 'valid');

    const paramType = this.route.snapshot.queryParamMap.get('type');
    if (paramType) {
      this.selectedPage = paramType;
    }
    else {
      this.selectedPage = 'plaintes'
    }
    this.switchPages(this.selectedPage);
    this.setUpPagination();
  }

  getUserData (id : string) : User {
    let user! : User;
    user = this.users.find(user => user.id === id)!;
    return user;
  }


  // ======SWITCHING THE DISPLAYED PLAINTES BASED ON THE SELECTED TYPE==========>
  selectedPage! : string; 

  switchPages (page : string) {
    switch (page) {
      case 'plaintes' : 
        this.showenPlaintes = this.plaintes;
        break;
      
      case 'plaintes_invalids' : 
        this.showenPlaintes = this.plaintesInvalids;
        break;

      case 'plaintes_non_exam' : 
        this.showenPlaintes = this.plaintesNonExam;
        break;

      default : 
        this.showenPlaintes = this.plaintes;
    }

    this.selectedPage = page;
    this.currentPage = 1;
    this.setUpPagination();
  }

  private route = inject(ActivatedRoute);
  ngOnInit () {
    this.loadData();    
  }

  // =======NAVIGATION TO THE DETAILS===============>
  private router = inject(Router);
  details (id : string) {
    this.router.navigate([`/home/details/plainte/${id}`]);
  }


    // PAGINATION METHODE =========>
    pageSize : number = 7;
    currentPage : number = 1;
    pages : number [] = [];
    paginatedPlaintes : any[] = [];
  
    showenPlaintes : Plaintes[] = []
  
    setUpPagination () {
      const totalPages = Math.ceil(this.showenPlaintes.length / this.pageSize);
      this.pages = Array.from({ length : totalPages }, (_, i) => i + 1);
      this.updatePaginatedPlaintes();
    }
    
    updatePaginatedPlaintes () {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.paginatedPlaintes = this.showenPlaintes.slice(startIndex, startIndex + this.pageSize);
    }
  
    changePange (page : number) {
      this.currentPage = page;
      this.updatePaginatedPlaintes();
    }
  
    
  
    
    
}
