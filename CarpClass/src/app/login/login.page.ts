import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login: any = {
    Usuario: "",
    Contrasena: ""
  };

  faltante: string = "";
  errorMessage: string = "";
  isLoading: boolean = false; // Nuevo: Indicador de carga

  constructor(
    public toastController: ToastController,
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() { }

  validateModel(model: any): boolean {
    for (let [key, value] of Object.entries(model)) {
      if (value === "") {
        this.faltante = key;
        return false;
      }
    }
    return true;
  }

  validarUsuario(dato: string): boolean {
    return dato.length >= 3 && (dato.includes('@duocuc.cl') || dato.includes('@profesor.duoc.cl'));
  }

  validarContra(dato: string): boolean {
    return dato.length >= 8 && dato.length <= 15;
  }

  resetForm(): void {
    // Nuevo: Función para limpiar el formulario tras errores
    this.login.Usuario = "";
    this.login.Contrasena = "";
  }

  ingresar(): void {
    this.errorMessage = ""; // Reiniciar mensaje de error

    // Validaciones iniciales
    if (!this.login.Usuario) {
      this.errorMessage = 'El correo es obligatorio.';
      return;
    }
    if (!this.validarUsuario(this.login.Usuario)) {
      this.errorMessage = "El usuario debe tener al menos 3 caracteres y debe incluir '@duocuc.cl' o '@profesor.duoc.cl'.";
      this.resetForm();
      return;
    }
    if (!this.login.Contrasena || this.login.Contrasena.length < 8) {
      this.errorMessage = 'La contraseña debe tener entre 8 y 15 caracteres.';
      this.resetForm();
      return;
    }

    if (this.validateModel(this.login)) {
      this.isLoading = true; // Activar indicador de carga

      this.authService.login(this.login.Usuario, this.login.Contrasena).subscribe(
        (response: any) => {
          this.isLoading = false; // Desactivar indicador de carga
          console.log('Respuesta completa de la API:', response);

          const role = response?.role?.trim().toLowerCase() || response?.rol?.trim().toLowerCase() || "no especificado";

          if (role === "no especificado") {
            this.presentToast("Error: El rol no fue especificado en la respuesta.");
            return;
          }

          const token = response.token;
          this.authService.storeToken(token, role);
          this.presentToast("¡Bienvenido " + this.login.Usuario + "!");

          let navigationExtras: NavigationExtras = {
            state: { user: this.login.Usuario }
          };

          if (role === 'docente') {
            this.router.navigate(['home'], navigationExtras);
          } else if (role === 'alumno') {
            this.router.navigate(['alumno'], navigationExtras);
          } else {
            this.presentToast(`Rol no reconocido o no especificado: ${role}`);
          }
        },
        (error: any) => {
          this.isLoading = false; // Desactivar indicador de carga
          console.error('Error al iniciar sesión:', error);
          if (error.status === 401) {
            this.presentToast("Credenciales inválidas. Intenta de nuevo.");
          } else {
            this.presentToast("Error al iniciar sesión. Por favor, verifica tus credenciales.");
          }
          this.resetForm();
        }
      );
    } else {
      this.presentToast("Falta rellenar el campo: " + this.faltante);
    }
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000
    });
    toast.present();
  }
}
