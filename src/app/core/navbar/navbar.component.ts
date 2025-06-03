import { Component, EventEmitter, inject, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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

  router = inject(Router);
  selectedItem : string | null = 'dashboard';
  ngOnInit() {
    const currentPage = localStorage.getItem('currentPage');
    this.selectedItem = currentPage ? currentPage : 'dashboard';

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/home/users')) {
          this.selectedItem = 'users_list';
        } else if (url.includes('/home/chefs')) {
          this.selectedItem = 'chefs';
        } else if (url.includes('/home/dashboard')) {
          this.selectedItem = 'dashboard';
        } else if (url.includes('/home/plaintes')) {
          this.selectedItem = 'plaintes';
        }
      }
    });
  }


  switchSelection (item : string) {
    this.selectedItem = item;
    localStorage.setItem('currentPage', this.selectedItem);
  }
}
