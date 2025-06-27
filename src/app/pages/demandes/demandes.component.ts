import { Component, inject } from '@angular/core';
import { DemandesService } from '../../services/demandes.service';
import { Demande } from '../../interfaces/demande';
import { Router } from '@angular/router';
import { UserService } from '../../services/usersService/user.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GalleryComponent } from '../../core/gallery/gallery.component';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demandes.component.html',
  styleUrl: './demandes.component.scss'
})
export class DemandesComponent {
  private demandesService = inject(DemandesService);
  private userService = inject(UserService);
  demandes : Demande[] = [];
  users : User[] = [];

  loadData () {
    this.demandesService.getDeamndes().subscribe(data => {
      this.demandes = data;
      this.filteredDemandes = this.demandes;
      this.showenDemandes = this.demandes;
      this.setUpPagination();

      this.userService.getUsers().subscribe(data => {
        this.users = data;
        console.log(this.users);
        
      });
    });
  }
  
  getUser (id : string) : User {
    const user = this.users.find(us => us.id === id)!;
    return user;
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
    pageSize : number = 6;
    currentPage : number = 1;
    pages : number [] = [];
    paginatedDemandes : any[] = [];
  
    showenDemandes : Demande[] = []
  
    setUpPagination () {
      const totalPages = Math.ceil(this.showenDemandes.length / this.pageSize);
      this.pages = Array.from({ length : totalPages }, (_, i) => i + 1);
      this.updatePaginatedDemandes();
    }
    
    updatePaginatedDemandes () {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.filteredDemandes = this.showenDemandes.slice(startIndex, startIndex + this.pageSize);
    }
  
    changePange (page : number) {
      this.currentPage = page;
      this.updatePaginatedDemandes();
    }

    
      // =====A METHODE TO SORT THE USERS TABLE========>
      filterOptions = [ 'Plus récent',  'Moins récent'];
  
      onSortChange (event : Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.sortDemande(value);
      }
    
    
      sortDemande (critere : string) {
        switch (critere) {
          case 'Plus récent' :
            this.filteredDemandes = [...this.showenDemandes];
            break;
    
          case 'Moins récent' :
            this.filteredDemandes = [...this.showenDemandes].reverse();
            break;
    
          default :
            this.filteredDemandes = [...this.showenDemandes];
            break;
        }
    
    
        this.currentPage = 1;
        this.setUpPagination();
      }
    
    
    
      // =====THE SEARCH LOGIC================>
      query : string = '';
      searchField : string = 'nni';
      showOptions : boolean = false;
      filteredDemandes : Demande[] = [];
    
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
    
        this.filteredDemandes = this.demandes.filter(demande => {
          const value = String(demande[this.searchField]).toLowerCase()
          return value.startsWith(serchQuery);
        });
    
        this.currentPage = 1;
        this.setUpPagination();
      }
    
      
      // ========THE DOCUMENTS GALLERY DISPLAY============>
      private dialog = inject(MatDialog);
      showDocuments (images : string []) {
        this.dialog.open(GalleryComponent, {
          data : {images},
          width : '50%',
        });
      }

      getDetails (id : string) {
        this.router.navigate(['/home/demande/details', id]);
      }
}
