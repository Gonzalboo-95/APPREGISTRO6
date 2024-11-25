import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Usuario {
  id: number;
  usuario: string;
  contrasena: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';
  private userRoleKey = 'userRole';
  private apiUrl = 'http://localhost:3000/usuarios'; // URL del endpoint de usuarios

  constructor(private http: HttpClient) {}

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.authTokenKey);
    return token ? !this.isTokenExpired(token) : false;
  }

  // Almacena el token y el rol en el almacenamiento local
  storeToken(token: string, role: string): void {
    localStorage.setItem(this.authTokenKey, token);
    localStorage.setItem(this.userRoleKey, role);
  }

  // Elimina el token y el rol del almacenamiento local
  removeToken(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userRoleKey);
  }

  // Obtiene el rol del usuario almacenado
  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  // Decodifica el token (simulado)
  decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;
      return JSON.parse(atob(payloadBase64));
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Verifica si el token ha expirado
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  }

  // Maneja el inicio de sesión
  login(usuario: string, contrasena: string): Observable<any> {
    // Usar POST en lugar de GET para enviar credenciales de forma más segura
    const url = `${this.apiUrl}/login`; // Endpoint para autenticación real
    const body = { usuario, contrasena }; // Cuerpo de la solicitud con las credenciales

    return this.http.post<any>(url, body).pipe(
      map((response) => {
        if (response && response.token) {
          const token = response.token;
          const role = response.rol || 'no especificado';
          this.storeToken(token, role);
          return { token, rol: role };
        } else {
          throw new Error('Credenciales inválidas');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un usuario por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un usuario existente
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Maneja errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
