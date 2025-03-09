import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <label for="email">Email</label>
        <input type="email" id="email" formControlName="email" placeholder="Ingrese su email" />
        
        <label for="password">Contraseña</label>
        <input type="password" id="password" formControlName="password" placeholder="Ingrese su contraseña" />
        
        <div class="checkbox-container">
          <input type="checkbox" id="terms" formControlName="terms" />
          <label for="terms">Acepto los términos y condiciones</label>
        </div>

        <button type="submit" [disabled]="loginForm.invalid">Ingresar</button>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      width: 300px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      text-align: center;
    }
    input {
      width: 100%;
      padding: 8px;
      margin: 5px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
    .error {
      color: red;
      margin-top: 10px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.errorMessage = 'Credenciales incorrectas'
    });
  }
}