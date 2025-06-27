import { Component, inject } from '@angular/core';
import { Plaintes } from '../../../interfaces/plaintes';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { UserService } from '../../../services/usersService/user.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { ShortenerPipe } from "../../../pipes/shortener.pipe";
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-plaintes-list',
  standalone: true,
  imports: [FormsModule, ShortenerPipe, MatIconModule,MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule,FormsModule,],
  templateUrl: './plaintes-list.component.html',
  styleUrl: './plaintes-list.component.scss'
})
export class PlaintesListComponent {

  // ============LOADING AND FILTERING DATA=========================>
  plaintes : Plaintes[] = [];
  plaintesValids : Plaintes[] = [];
  plaintesNonExam : Plaintes[] = [];
  plaintesInvalids : Plaintes[] = [];
  plaintesEncours : Plaintes[] = [];
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
    this.plaintesEncours = this.plaintes.filter(pl => pl.etat === 'en cours');
    this.plaintesInvalids = this.plaintes.filter(pl => pl.etat === 'invalid');
    this.plaintesNonExam = this.plaintes.filter(pl => pl.etat === 'en attente');
    this.plaintesValids = this.plaintes.filter(pl => pl.etat === 'valid');

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

  getUserData (id : string) : User {
    let user! : User;
    user = this.users.find(user => user.id === id)!;
    return user;
  }


  // ======SWITCHING THE DISPLAYED PLAINTES BASED ON THE SELECTED TYPE==========>
  selectedPage! : string; 
  onSortChange (event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.switchPages(value);
  }

  switchPages (page : string) {
    switch (page) {
      case 'plaintes' : 
        this.showenPlaintes = this.plaintes;
        break;
      
      case 'valids' :
        this.showenPlaintes = this.plaintesValids;
        break;
      
      case 'invalids' : 
        this.showenPlaintes = this.plaintesInvalids;
        break;

      case 'en_attente' : 
        this.showenPlaintes = this.plaintesNonExam;
        break;
        
      case 'en_cours' : 
        this.showenPlaintes = this.plaintesEncours;
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

    
    // ==================FILTRAGE AVANCE=================>
    filtrageVisible : boolean = false;
    importOptionsVisible : boolean = false;  
    toggleFiltrageWithImports (showFiltrage : boolean, showImports : boolean) {
      this.selectedCommunes = [];
      this.filtrageVisible = showFiltrage;

      if (showImports) {
        this.importOptionsVisible = showImports;
      }
      
      if (!this.filtrageVisible) {
        this.importOptionsVisible = false;
      }

      console.log(`imports : ${this.importOptionsVisible}\nfilters ${this.filtrageVisible}`);
    }

    filterOption : string = 'commune';
    setFilterOption (event : Event) {
      const option = (event.target as HTMLSelectElement).value;
      this.filterOption = option;
      console.log(this.filterOption);
    }

    communes = ["Dar-Naim", "Teyarett", "Toujounine", "Ksar", "Tevragh-Zeina", "Sebkha", "Arafat", "El Mina", "Riyad"];
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

    filtredPlaintes : Plaintes [] = [];
    filter() {
      if (this.filterOption === 'commune') {
        this.showenPlaintes = this.plaintes.filter(pl => this.selectedCommunes.includes(pl.commune));
        this.filtredPlaintes = this.showenPlaintes;
      }
      
      else if (this.filterOption === 'user') {
        const query = this.userQuery.trim().toLowerCase();
        
        this.showenPlaintes = this.plaintes.filter(pl => {
          const user = this.getUserData(pl.user_id);
          return (
            user?.name?.toLowerCase().startsWith(query) ||
            user?.tel?.toString().replace(/\s+/g, '').startsWith(query.replace(/\s+/g, ''))
          );
        });
        this.filtredPlaintes = this.showenPlaintes;
      }
      
      else if (this.filterOption === 'chef') {
        const query = this.userQuery.trim().toLowerCase();
        
        this.showenPlaintes = this.plaintes.filter(pl => {
          const chef = this.getUserData(pl.chef_id);
          return (
            chef?.name?.toLowerCase().startsWith(query) ||
            chef?.tel?.toString().replace(/\s+/g, '').startsWith(query.replace(/\s+/g, ''))
          );
        });
        this.filtredPlaintes = this.showenPlaintes;

      }
      else if (this.filterOption === 'details') {
        this.showenPlaintes = this.plaintes.filter(pl => this.translateDetails(pl.details) === this.selectedDetail);
      }
      else if (this.filterOption === 'date') {
        let input = this.selectedDateString.trim();
        let selectedYear: number | null = null;
        
        if (this.selectedDate instanceof Date && !isNaN(this.selectedDate.getTime())) {
          selectedYear = this.selectedDate.getFullYear();
        }
        else if (/^\d{4}$/.test(input)) {
          selectedYear = parseInt(input, 10);
        }
        
        else if (!isNaN(Date.parse(input))) {
          selectedYear = new Date(input).getFullYear();
        }
        
        if (selectedYear) {
          this.showenPlaintes = this.plaintes.filter(pl =>
            new Date(pl.created_at).getFullYear() === selectedYear
          );
          this.filtredPlaintes = this.showenPlaintes;

        }
      }
      
      this.filtrageVisible = false;
      this.setUpPagination();
      this.filtredPlaintes = this.showenPlaintes;

    }


    detailsList = ['Produit périmé', 'Produit contaminé', 'Produit avarié', 'Emballage endommagé', 'Présence de corps étrangers', 'Odeur ou goût anormal'];
    selectedDetail : string = 'Produit périmé';

    onSelectDetail (event : Event) {
      this.selectedDetail = (event.target as HTMLSelectElement).value;
      console.log(this.selectedDetail);
    }

    
    selectedDate: Date = new Date();
    selectedDateString: string = '';
    showCalendar = false;

    onDateSelected(date: Date) {
      this.selectedDateString = date.getFullYear().toString();
      this.showCalendar = false;
    }


    // ================MANAGING THE EXPORT============================>

      fileName = `Plaintes-${this.filterOption}-${this.filterOption === 'commune' ? this.selectedCommunes : this.filterOption === 'user' || this.filterOption === 'chef' ? this.userQuery : this.filterOption === 'details' ? this.selectedDetail : this.selectedDateString}`;
  
      // ==========EXPORTING DATA AS EXCEL AND PDF===========================>
      exportTable(data: any[], format: 'excel' | 'pdf', filename: string = 'export') {
        if (!data || data.length === 0) {
          console.warn('No data to export');
          return;
        }
      
        const exportData = data.map(pl => {
          const user = this.getUserData(pl.user_id);
          const chef = this.getUserData(pl.chef_id); 
      
          const validEtats = ['valid', 'invalid', 'en cours'];
          const etat = pl.etat?.toLowerCase() || '';

          return {
            Code: pl.code,
            Détail: this.translateDetails(pl.details),
            Commune: pl.commune,
            État: pl.etat,
            Nom_utilisateur: user?.name || 'Inconnu',
            Téléphone_utilisateur: user?.tel || 'N/A',
            Nom_inspecreur: validEtats.includes(etat) ? chef?.name : 'Indefinie',
            Téléphone_inspecteur: validEtats.includes(etat) ? chef?.tel : 'N/A',
            Rapport: ['valid', 'invalid'].includes(etat) ? pl.rapport : 'Indefinie',
            Date_de_création: new Date(pl.created_at).toLocaleDateString()
          };
        });
      
        const headers = Object.keys(exportData[0]);
        const rows = exportData.map(item => headers.map(key => (item as any)[key]));
      
        if (format === 'excel') {
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'Sheet1': worksheet },
            SheetNames: ['Sheet1']
          };
          XLSX.writeFile(workbook, `${filename}.xlsx`);
        }
      
        else if (format === 'pdf') {
          const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
          autoTable(doc, {
            head: [headers],
            body: rows,
            styles: {
              fontSize: 10,
              cellPadding: 2,
              overflow: 'linebreak',
              valign: 'middle'
            },
            columnStyles: {
              0: { cellWidth: 35 }, // Code
              1: { cellWidth: 35 }, // Détail
              2: { cellWidth: 25 }, // Commune
              3: { cellWidth: 20 }, // État
              4: { cellWidth: 35 }, // Nom_utilisateur
              5: { cellWidth: 30 }, // Téléphone_utilisateur
              6: { cellWidth: 35 }, // Nom_inspecteur
              7: { cellWidth: 30 }, // Téléphone_inspecteur
              8: { cellWidth: 100 }, // Rapport
              9: { cellWidth: 25 }, // Date_de_création
            },
            margin: { top: 20 },
            didDrawCell: (data) => {
              doc.setFontSize(10);
            }
          });
          
          doc.save(`${filename}.pdf`);
        }
      }

      getExportFilteredData(): any[] {
        let filtered = this.plaintes;
      
        if (this.filterOption === 'commune') {
          filtered = this.plaintes.filter(pl => this.selectedCommunes.includes(pl.commune));
        }
      
        else if (this.filterOption === 'user') {
          const query = this.userQuery.trim().toLowerCase();
          filtered = this.plaintes.filter(pl => {
            const user = this.getUserData(pl.user_id);
            return (
              user?.name?.toLowerCase().startsWith(query) ||
              user?.tel?.toString().replace(/\s+/g, '').startsWith(query.replace(/\s+/g, ''))
            );
          });
        }
      
        else if (this.filterOption === 'chef') {
          const query = this.userQuery.trim().toLowerCase();
          filtered = this.plaintes.filter(pl => {
            const chef = this.getUserData(pl.chef_id);
            return (
              chef?.name?.toLowerCase().startsWith(query) ||
              chef?.tel?.toString().replace(/\s+/g, '').startsWith(query.replace(/\s+/g, ''))
            );
          });
        }
      
        else if (this.filterOption === 'details') {
          filtered = this.plaintes.filter(pl =>
            this.translateDetails(pl.details).split('-')[0].trim() === this.selectedDetail
          );
        }
      
        else if (this.filterOption === 'date') {
          let input = this.selectedDateString.trim();
          let selectedYear: number | null = null;
      
          if (this.selectedDate instanceof Date && !isNaN(this.selectedDate.getTime())) {
            selectedYear = this.selectedDate.getFullYear();
          } else if (/^\d{4}$/.test(input)) {
            selectedYear = parseInt(input, 10);
          } else if (!isNaN(Date.parse(input))) {
            selectedYear = new Date(input).getFullYear();
          }
      
          if (selectedYear) {
            filtered = this.plaintes.filter(pl =>
              new Date(pl.created_at).getFullYear() === selectedYear
            );
          }
        }
      
        return filtered;
      }
      
      
      exportFilteredOnly(format: 'pdf' | 'excel') {
        const rawData = this.getExportFilteredData();
        if (rawData.length > 0) {
          this.exportTable(rawData, format, this.fileName);
        }
        else {
          this.exportTable(this.plaintes, format, this.fileName);
        }
      }
            
}
