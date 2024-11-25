import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage {
  username: string = ''; 
  email:string = ''; 
  password: string = ''; 
  confirmPassword: string = ''; 
  role: string = 'estudiante'; 
  errorMessage: string = ''; 

  constructor(private router: Router) {}

  register() {
    if (!this.username) {
      this.errorMessage = 'El nombre de usuario es obligatorio.';
      return;
    }
  
    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.errorMessage = 'El correo electrónico no es válido.';
      return;
    }
  
    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.role === 'docente' && !this.email.endsWith('@profesor.duocuc.cl')) {
      this.errorMessage = 'El correo electrónico debe ser del formato para docentes.';
      return;
    }
    if (this.role === 'estudiante' && this.email.endsWith('@profesor.duocuc.cl')) {
      this.errorMessage = 'El correo electrónico debe ser del formato para estudiantes.';
      return;
    }
    // Visualizar en consola 
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    console.log('Email:', this.email);
  
    sessionStorage.setItem('username', this.username);
    sessionStorage.setItem('password', this.password);
    sessionStorage.setItem('email', this.email);
    sessionStorage.setItem('role', this.role);
  
    this.router.navigate(['/login']);
  }
  
}
