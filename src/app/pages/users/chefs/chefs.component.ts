import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../core/alert/alert.component';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/usersService/user.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [FormsModule, MatIcon],
  templateUrl: './chefs.component.html',
  styleUrl: './chefs.component.scss'
})
export class ChefsComponent {
currentDisplayPage : string = 'chefs'
  fromPage : string = 'home';


    // ======NAVIGATE TO THE DETAILS PAGE===========>
    router = inject(Router);  
    details (id : string) {
      localStorage.setItem('fromPage', this.fromPage);
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
      this.users = data.filter(user => user.role == 'CHEF').reverse();
      this.originalUsers = [...data].filter(user => user.role == 'CHEF').reverse();
      this.filteredUsers = data.filter(user => user.role == 'CHEF').reverse();
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

  searchFields = ['name', 'tel', 'nni', 'commune'];

  getSearchLabel (field : string) : string {
    switch (field) {
      case 'name' : 
        return 'Par le nom';
      case 'nni' :
        return "Par l'NNI";
      case 'tel' :
        return "Par le numero du telephone";
      case 'commune' :
        return "Par la Commune";
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
                'Utilisateur blocke avec success.',
                'success',
                true,
                true,
                false
              );
            },
            error: (err) => {
              this.showAlert(
                'Erreur',
                "Un errur est produit.",
                'error',
                true,
                true,
                false
              );
            }
          });
        }
      );
    }
  }

  // ============IMPORTS AND FILTERS===================>
  filterVisible : boolean = false;
  toggleFilters (show : boolean) {
    this.filterVisible = show;
  }


  filterOption : string = 'commune';
  selectFilterOption (event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterOption = value;
  }

  
  
  communes = ["Dar Naim", "Teyarett", "Toujounine", "Ksar", "Tevragh-Zeina", "Sebkha", "Arafat", "El Mina", "Riad"];
  selectedCommunes : string [] = [];

  toggleCommunes (commune : string , event : Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedCommunes.push(commune);
      console.log(`Commune added : ${this.selectedCommunes}`);
    }
    else {
      this.selectedCommunes = this.selectedCommunes.filter(c => c !== commune);
      console.log(`Commune removed : ${this.selectedCommunes}`);
    }
  }

  userQuery! : string;

  exportTable (data : User [] , format : 'pdf' | 'excel', fileName : string = 'Inspecteurs') {
    if (!data || data.length === 0) {
      console.error('NO DATA TO EXPORT');
    }

    const exportData = data.map( user => {
      return {
        Nom : user.name,
        NNI : user.nni,
        Telephone : user.tel,
        Commune : user.commune
      }
    });

    if (format === 'pdf') {
      const headers = Object.keys(exportData[0]);
      const rows = exportData.map(user => headers.map(key => (user as any)[key]));
      const doc = new jsPDF();

      autoTable (doc , {
        head : [headers],
        body : rows
      });

      doc.save(`${fileName}.pdf`);
    }
    else if (format === 'excel') {
      const workSheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      const workBook : XLSX.WorkBook = {
        Sheets : {'Sheet 1' : workSheet},
        SheetNames : ['Sheet 1']
      };

      XLSX.writeFile(workBook, `${fileName}.xlsx`);
    }
  }

  
  filterExport (format : 'excel' | 'pdf') {
    let finalData = []
    if (this.selectedCommunes.length === 0) {
      finalData = this.filteredUsers;
    }
    else {
      console.log(this.selectedCommunes);
      
      finalData = this.filteredUsers.filter(user => 
        this.selectedCommunes.some( comm => 
          comm.trim().toLocaleLowerCase() === user.commune.trim().toLowerCase()
        )
      );
    }

    let communeNames = this.selectedCommunes.join('_');
    let fileName = this.selectedCommunes.length > 0 ? `Inspecteurs_${communeNames}` : 'Inspecteurs';
    this.exportTable(finalData, format, fileName);

    console.log(`Data : ${finalData}\nfileName : ${fileName}\nformat : ${format}`);
    
  }
}