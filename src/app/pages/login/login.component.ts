import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from '../../core/alert/alert.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

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
  loginForm!: FormGroup;
  
  constructor () {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]]
    });
  }
  // ======================================================================================================================================================
  
  // ===========================================FORM SUBMISSON AND VALIDATION=====================================================
  isValid : boolean = true;
  http = inject(HttpClient);
  onSubmit () {

    if (this.loginForm.get('password')?.hasError('pattern')) {
      this.isValid = false;
      this.showAlert('ERREUR !!',
        'Le mot de passe doit contenir plus de 6 caractères et inclure au moins un chiffre et une lettre.', 
        'error', 
        true, 
        true, 
        false);
    }
    else if (this.loginForm.get('password')?.hasError('required')) {
      this.isValid = false;
      this.showAlert('ERREUR !!', 'Le mot de passe est requis pour se connecter.', 'error', true, true, false);
    }
    else {
      // this.http.post<any>()
      this.showAlert('SUCCESS', 'Bienvenue.', 'success', false, true, false);
      this.redirectToHome();
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
  
  
  // ========================================DECLARING THE REDIRECT FUNCTION==================================================
    
  isFading: boolean = false;
  router = inject(Router);

  redirectToHome () {
    this.isFading = true;

    setTimeout (() => {
      this.router.navigate(['/home']);
    }, 2000)
  }
  // =========================================================================================================================

}
