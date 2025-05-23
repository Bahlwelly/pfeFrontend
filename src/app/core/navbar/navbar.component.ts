import { Component, EventEmitter, inject, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
  @Output() logout = new EventEmitter<void>;
  
  onLogout () {
    this.logout.emit();
  }

  
  selectedItem : string | null = 'users_list';
  ngOnInit() {
    const currentPage = localStorage.getItem('currentPage');
    if (currentPage) {
      this.selectedItem = currentPage;
    } 
    else {
      this.selectedItem = 'users_list';
    }
  }
  
  switchSelection (item : string) {
    this.selectedItem = item;
    localStorage.setItem('currentPage', this.selectedItem);
  }
}
