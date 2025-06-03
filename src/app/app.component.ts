import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AlertComponent } from "./core/alert/alert.component";
import { LoadingComponent } from "./core/loading/loading.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AlertComponent, LoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'pfe_admin_dashboarda';
  
  ngOnDestroy () {
    sessionStorage.removeItem('token');
  }
}
