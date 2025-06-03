import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { NavbarComponent } from "../../core/navbar/navbar.component";
import { Router, RouterOutlet } from '@angular/router';
import { AlertComponent } from '../../core/alert/alert.component';
import { LoadingComponent } from "../../core/loading/loading.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, LoadingComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
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

    router = inject(Router);
    
    confirmLogout () {
      this.showAlert(
        'Etes-vous sur ?',
        "Voulez vous vraiment quitter l'application",
        'info',
        false,
        false,
        true,
        () => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      )
    }
}
