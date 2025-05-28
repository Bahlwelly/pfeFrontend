import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/usersService/user.service';
import { User } from '../../../interfaces/user';
import { PlaintesService } from '../../../services/plaintesService/plaintes.service';
import { Plaintes } from '../../../interfaces/plaintes';
import { ShortenerPipe } from "../../../pipes/shortener.pipe";
import { AlertComponent } from '../../../core/alert/alert.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, ShortenerPipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  // =====REIDRECTING THE USER TO THE PREVIOUS PAGE=============>
  previousPage : string = 'users_list';
  router = inject(Router);
  back() {
    if (this.previousPage == 'list_noir') {
      this.router.navigate(['/home/users/noir']);
    }
    else if (this.previousPage === 'users_list') {
      this.router.navigate(['/home/users']);
    }
    else if (this.previousPage === 'chefs') {
      this.router.navigate(['/home/chefs']);
    }
  }

  // ====GETTING THE USER DETAILS=========>
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  user! : User; 
  private subscriptions = new Subscription();

  loadUserDetails (id : string) {
    this.userService.getUserDetails(id).subscribe(
      (data) => {
        this.user = data;
        this.loadUserPlaintes();
        console.log(`User ${this.user.id} loaded !!`);
      },
      (error) => {
        console.error(`error feching data ${error}`);
      }
    );
  }

  ngOnInit () {
    this.previousPage = localStorage.getItem('currentPage')!;
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id')!;
        this.loadUserDetails(id);
      })
    );
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe();
  }

  // ====GETTING THE USERS PLAINTES================>
  
  plaintesService = inject(PlaintesService);
  plaintes : Plaintes [] = [];
  loadUserPlaintes () {
    if (!this.user || !this.user.id) {
      console.error('User data not available');
      return;
    }
    this.plaintesService.getPlaintes().subscribe(data => {
      this.plaintes = data.filter(plainte => plainte.user_id == this.user.id);
    });
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
  signal () {
    this.showAlert(
      'Etes-vous sur ?',
      "Voulez vous vraiment signaler cet utilisateur ?",
      "info",
      false,
      false,
      true, 
      () => {
        this.userService.signal(this.user.id, this.user.signal).subscribe({
            next : () => {
              this.showAlert(
              'Success',
              "L'utilisateur ete signale avec succe.",
              "success",
              true,
              true,
              false
            );

            setTimeout (() => {
              location.reload();
            }, 2000);
          },
          error : () => {
            this.showAlert(
              'Erreur',
              "Un erreur c'est produit esseyer encore",
              "error",
              true,
              true,
              false
            );
          }
        });
      }
    );
  }




  // =====SWITCH ROLE METHODE======================>
  switchRole () {
    this.showAlert(
      'Etes vous sur ?',
      'Voulez vous vraiment nommer cet utilisateur comme admin',
      'info',
      false,
      false,
      true,
      () => {
        
      }
    )
  }
}

