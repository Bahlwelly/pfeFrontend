import { Component, inject } from '@angular/core';
import { Plaintes } from '../../../interfaces/plaintes';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { UserService } from '../../../services/usersService/user.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-plaintes-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './plaintes-list.component.html',
  styleUrl: './plaintes-list.component.scss'
})
export class PlaintesListComponent {
  plaintesWithUsers : any[] = [];
  users : User[] = [];
  plaintesService = inject(PlaintesService);
  usersService = inject(UserService);
  
  loadData () {
    forkJoin({
      plaintes : this.plaintesService.getPlaintes(),
      users : this.usersService.getUsers()
    }).subscribe(({ plaintes, users }) => {
      this.users = users;
      this.plaintesWithUsers = plaintes.map(p =>({ ...p, user: users.find(u => +u.id === +p.user_id) || null}));
      this.filteredPlaintes = this.plaintesWithUsers;
      this.setUpPagination()
    });
  }


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
  
  
    setUpPagination () {
      const totalPages = Math.ceil(this.filteredPlaintes.length / this.pageSize);
      this.pages = Array.from({ length : totalPages }, (_, i) => i + 1);
      this.updatePaginatedPlaintes();
    }
    
    updatePaginatedPlaintes () {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.paginatedPlaintes = this.filteredPlaintes.slice(startIndex, startIndex + this.pageSize);
    }
  
    changePange (page : number) {
      this.currentPage = page;
      this.updatePaginatedPlaintes();
    }
  

      // =====A METHODE TO SORT THE USERS TABLE========>
  filterOptions = [ 'Plus récent',  'Moins récent', 'A-Z', 'Z-A'];

    
    
      onSortChange (event : Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.sortUsers(value);
      }
    
    
      sortUsers (critere : string) {
        switch (critere) {
          case 'Plus récent' :
            this.filteredPlaintes = [...this.plaintesWithUsers];
            break;
    
          case 'Moins récent' :
            this.filteredPlaintes = [...this.plaintesWithUsers].reverse();
            break;
    
          default :
            this.filteredPlaintes = [...this.plaintesWithUsers];
            break;
        }
    
    
        this.currentPage = 1;
        this.setUpPagination();
      }
    
    
    
      // =====THE SEARCH LOGIC================>
      query : string = '';
      searchField : string = 'nni';
      showOptions : boolean = false;
      filteredPlaintes : any[] = [];
    
      searchFields = ['name', 'tel', 'nni'];
    
      getSearchLabel (field : string) : string {
        switch (field) {
          case 'name' : 
            return 'Par le nom';
          case 'nni' :
            return "Par l'NNI";
          case 'tel' :
            return "Par le numero du telephone";
          default :
            return field;
        }
      }
    
      toggleOptions () {
        this.showOptions = !this.showOptions;
      }
    
      selectField (field : string) {
        this.searchField = field;
        this.showOptions = false;
      }
    
      filterPlaintes () {
        const serchQuery = this.query.toString().toLowerCase().trim();
    
        this.filteredPlaintes = this.plaintesWithUsers.filter(plainte => {
          const value = String(plainte[this.searchField]).toLowerCase()
          return value.startsWith(serchQuery);
        });
    
        this.currentPage = 1;
        this.setUpPagination();
      }
    
    
    
    
}
