import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private api_key = 'AIzaSyDVQQ3TdB0P515hgO8QzFQhguAlE_ijmNA';
  userToken: string;

  // Create new User.
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Log in User.
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  
  constructor(private http: HttpClient) { 
    this.readToken();
  }

  // Desconectar sesión.
  logout() {
    localStorage.removeItem('token');
  }

  // Iniciar sesión.
  login(user: UserModel) {
    const auth_data = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signInWithPassword?key=${ this.api_key }`,
      auth_data
    ).pipe(
      map( resp => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );

  }

  // Registrar usuario.
  register(user: UserModel) {
    const auth_data = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signUp?key=${ this.api_key }`,
      auth_data
    ).pipe(
      map( resp => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  // Guardar Token.
  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expiresIn', today.getTime().toString());
  }

  // Obtenemos el Token.
  readToken() {
    if(localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  // Verificar autenticación.
  authenticated(): boolean {

    if(this.userToken.length < 3)  {
      return false;
    }

    const expiresIn = Number(localStorage.getItem('expiresIn'));
    const expireDate = new Date();
    expireDate.setTime(expiresIn);

    if(expireDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

}
