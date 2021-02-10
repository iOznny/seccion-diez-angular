import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit {

  user: UserModel;
  remind_me: boolean = false;

  constructor(private auth: AuthService, private router: Router) { 
  }

  ngOnInit() { 
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {

    if(form.invalid) { 
      return; 
    }

    // Alerta dinamica para enviar el Espere por favor.
    Swal.fire({
      icon: 'info',
      text: 'Espere por favor.',
      allowOutsideClick: false
    });
    // El botton cambia a loading.
    Swal.showLoading();

    this.auth.register(this.user).subscribe( resp => {
      console.log(resp);
      Swal.close();

      // Guardamos el recordarme en caso de que este activo.
      if(this.remind_me) {
        localStorage.setItem('email', this.user.email);
      }

      // Eliminamos el recordarme en caso de que este inactivo.
      if(!this.remind_me) {
        localStorage.removeItem('email');
      }

      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err.error.error.message);
      // Alerta dinamica para enviar el Error.
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error al registrar su cuenta',
        text: err.error.error.message
      });
    });
  }



}
