import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/usersService/user.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../core/alert/alert.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  currentDisplayPage : string = 'users_list'


    // ======NAVIGATE TO THE DETAILS PAGE===========>
    router = inject(Router);  
    details (id : string) {
      this.router.navigate([`/home/user/details/${id}`]);
    }
  


  // PAGINATION METHODE =========>
  pageSize : number = 7;
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
      this.users = data.filter(user => (user.role == 'CITOYEN' && user.blocquee !== 'blocquee')).reverse();
      this.originalUsers = [...data].filter(user => (user.role == 'CITOYEN' &&  user.blocquee !== 'blocquee')).reverse();
      this.filteredUsers = data.filter(user => (user.role == 'CITOYEN' && user.blocquee !== 'blocquee')).reverse();
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
        this.filteredUsers = [...this.originalUsers];
        break;

      case 'Moins récent' :
        this.filteredUsers = [...this.originalUsers].reverse();
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



  //======SIGNAL METHODE=============>
  signal(user: User, currentCount: number) {
    if (currentCount < 2) {
      this.showAlert(
        'Etes-vous sûr ?',
        "Voulez-vous vraiment signaler cet utilisateur ?",
        "info",
        false,
        false,
        true,
        () => {
          this.userService.signal(user.id, currentCount).subscribe({
            next: () => {
              this.showAlert(
                'Succès',
                "L'utilisateur a été signalé avec succès.",
                "success",
                true,
                true,
                false
              );

              setTimeout(() => {
                location.reload();
              }, 2000);
            },
            error: () => {
              this.showAlert(
                'Erreur',
                "Une erreur s'est produite. Essayez encore.",
                "error",
                true,
                true,
                false
              );
            }
          });
        }
      );
    } else {
      this.showAlert(
        'Etes-vous sûr ?',
        "Voulez-vous vraiment bloquer cet utilisateur ?",
        "info",
        false,
        false,
        true,
        () => {
          this.userService.signal(user.id, currentCount + 1).subscribe({
            next: () => {
              this.showAlert(
                'Success',
                "Utilisateur blocquee avec succee",
                "success",
                true,
                true,
                false
              );
              setTimeout(() => {
                location.reload();
              }, 2000);
            },
            error: (err) => {
              console.log(`Something went wrong while signaling before blocking: ${err}`);
            }
          });
        }
      );
    }
  }
  
}


