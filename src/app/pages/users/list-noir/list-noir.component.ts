import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from '../../../core/alert/alert.component';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/usersService/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { state } from '@angular/animations';

@Component({
  selector: 'app-list-noir',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './list-noir.component.html',
  styleUrl: './list-noir.component.scss'
})
export class ListNoirComponent {
  // ======NAVIGATE TO THE DETAILS PAGE===========>
  router = inject(Router);  
  currentDisplayPage: string = 'list_noir';
  details (id : string) {
    this.router.navigate([`/home/user/details/${id}`]);
  }

  // PAGINATION METHODE =========>
  pageSize : number = 6;
  currentPage : number = 1;
  pages : number [] = [];


  setUpPagination () {
    const totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pages = Array.from({ length : totalPages }, (_, i) => i + 1);
    console.log(this.pages);
  }
  
  get paginatedUsers () {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    console.log('the get users works');
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  changePange (page : number) {
    this.currentPage = page;
  }

  // GETTING THE USERS FROM THE SERVICE =====>
  users : User[] = [];
  userService = inject(UserService);

  loadUsers () {
    this.userService.getUsers().subscribe(data => {
      this.users = data.filter(user => user.role === 'CITOYEN' && user.blocquee === 'blocquee');
      this.originalUsers = [...data].filter(user => user.role === 'CITOYEN' && user.blocquee === 'blocquee');
      this.filteredUsers = data.filter(user => user.role === 'CITOYEN' && user.blocquee === 'blocquee');
      console.log(this.users);
      
      this.setUpPagination();
    });
  }
  
  ngOnInit () {
    this.loadUsers();
    localStorage.setItem('currentPage', this.currentDisplayPage);
  }



  // =====A METHODE TO SORT THE USERS TABLE========>
  filterOptions = [ 'Plus récent',  'Moins récent', 'A-Z', 'Z-A'];
  originalUsers : User[] = [];


  onSortChange (event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortUsers(value);
    console.log(this.originalUsers);
    
  }


  sortUsers (critere : string) {
    switch (critere) {
      case 'Plus récent' :
        this.filteredUsers = [...this.originalUsers].reverse();
        break;

      case 'Moins récent' :
        this.filteredUsers = [...this.originalUsers];
        break;

      case 'A-Z'  :
        this.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'Z-A'  :
        this.filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;

      default :
        this.filteredUsers = [...this.originalUsers];
        break;
    }


    this.currentPage = 1;
    this.setUpPagination();
  }



  // =====THE SEARCH LOGIC================>
  query : string = '';
  searchField : string = 'nni';
  showOptions : boolean = false;
  filteredUsers : User[] = [];

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

  filterUsers () {
    const serchQuery = this.query.toString().toLowerCase().trim();

    this.filteredUsers = this.users.filter(user => {
      const value = String(user[this.searchField]).toLowerCase()
      return value.startsWith(serchQuery);
    });

    this.currentPage = 1;
    this.setUpPagination();
  }



  // ================================================DECLARING THE ALERT COMPONENT==========================================================================
  @ViewChild ('alert', {read : ViewContainerRef}) alert! : ViewContainerRef;
  
  showAlert (title : string,
    message: string, 
    type: 'error' |'success' | 'info', 
    closable: boolean, autoDissmiss: boolean, 
    confirmation: boolean,
    onConfirmCallback ? : () => void) {
    const alert_box  = this.alert.createComponent(AlertComponent);
    
    alert_box.instance.title = title;
    alert_box.instance.message = message;
    alert_box.instance.type = type;
    alert_box.instance.closable = closable;
    alert_box.instance.autoDissmiss = autoDissmiss;
    alert_box.instance.confirmation = confirmation;
  
    if (onConfirmCallback) {
      alert_box.instance.confirm.subscribe(() => {
        onConfirmCallback();
        alert_box.destroy();
      });
    }
  }

  // =====RESTORE THE BLOCKED USERS===============>
  

}
