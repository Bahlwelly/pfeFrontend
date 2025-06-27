import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AlertComponent } from '../alert/alert.component';
import { LoadingComponent } from "../loading/loading.component";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  // ================================================DECLARING THE ALERT COMPONENT==========================================================================
  @ViewChild('alert', {read : ViewContainerRef}) alert! : ViewContainerRef;
  
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
  // =======================================================================================================================================================



  // ===========================================DECLARING THE FORM AND APPLYING THE RULES ON THE INPUTS=====================================================
  private fb = inject(FormBuilder);
  registerForm!: FormGroup;
  
  constructor () {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required]],
      conf_password : ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]]
    });
  }
  // ======================================================================================================================================================
  
  // ===========================================FORM SUBMISSON AND VALIDATION=====================================================
  isValid : boolean = true;
  private loginService = inject(LoginService);
  onSubmit () { 
    if (this.registerForm.get('email')?.hasError('required')) {
      this.isValid = false;
      this.showAlert('ERREUR !!', "L'email est requis pour s'insecrir.", 'error', true, true, false);
    }
    else if (this.registerForm.get('password')?.hasError('required')) {
      this.isValid = false;
      this.showAlert('ERREUR !!', "Le mot de passe est requis pour s'inscrir.", 'error', true, true, false);
    }
    else if (this.registerForm.get('conf_password')?.hasError('required')) {
      this.isValid = false;
      this.showAlert('ERREUR !!', 'Il faut confirmer le mot de pass pour inscrir.', 'error', true, true, false);
    }
    else if (this.registerForm.get('conf_password')?.value !== this.registerForm.get('password')?.value) {
      this.isValid = false;
      this.showAlert('ERREUR !!', 'Le mot de passe de confirmation ne correspond pas au mot de passe saisi.', 'error', true, true, false);
    }
    else {
      const password = this.registerForm.get('password')?.value;
      const email = this.registerForm.get('email')?.value;
      this.loginService.addAdmin(email, password).subscribe({
        next : () =>  {
          this.showAlert('SUCCESS', 'Bienvenue.', 'success', false, true, false);
          setTimeout (() => {
            this.redirectToHome();
          }, 2000);
        },
        error : (err) => {
          this.showAlert('ERREUR', err.error.message , 'error', false, true, false);
          console.log(err);
          
        }
      });
      // this.http.post<any>()
    }
  }
  // ==========================================================================================================================
  
  
  // ===========================================ADDING THE PASSWORD TOGGLE (SHOW / HIDE)=====================================================
  isPasswordVisible: boolean = false;

  togglePassword (passwordInput : HTMLInputElement) {
    if (passwordInput.type == 'password') {
      passwordInput.type = 'text';
      this.isPasswordVisible = true;
    }
    else {
      passwordInput.type = 'password';
      this.isPasswordVisible = false;
    }

    setTimeout(() => passwordInput.focus(), 0);
  }
  // ========================================================================================================================================
  // ===========================================ADDING THE PASSWORD TOGGLE (SHOW / HIDE)=====================================================
  isConfPasswordVisible: boolean = false;
  toggleConfPassword (confPasswordInput : HTMLInputElement) {
    if (confPasswordInput.type == 'password') {
      confPasswordInput.type = 'text';
      this.isConfPasswordVisible = true;
    }
    else {
      confPasswordInput.type = 'password';
      this.isConfPasswordVisible = false;
    }

    setTimeout(() => confPasswordInput.focus(), 0);
  }
  // ========================================================================================================================================
  
  
  // ========================================DECLARING THE REDIRECT FUNCTION==================================================
    
  isFading: boolean = false;
  router = inject(Router);

  redirectToHome () {
    this.isFading = true;

    setTimeout (() => {
      this.router.navigate(['/']);
    }, 2000)
  }
  // =========================================================================================================================

}
