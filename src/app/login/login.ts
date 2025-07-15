import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router} from '@angular/router'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,MatCardModule,MatInputModule,MatButtonModule,MatIconModule,MatFormFieldModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{

  userList: any[]=[];
  http = inject(HttpClient);
  
  usuario={
    email:'',
    password:'',
  };

  ngOnInit(): void {
    debugger;
    this.getUsers();
  }
  

  getUsers() {
  this.http.get("https://68743fcedd06792b9c937143.mockapi.io/api/users").subscribe((result: any) => {
    this.userList = result;
    console.log("Usuarios cargados:", this.userList); 
  }, error => {
    console.error("Error al cargar usuarios", error);
  });
}

  

  login() {
  const esFormatoValido = this.validarFormatoPassword(this.usuario.password);
  const longitud = this.validarLongitud(this.usuario.password);
  console.log(this.usuario.email);
  if (!longitud) {
    this.loginValidado = false;
    alert("La contraseña debe contener al menos 8 caracteres");
    return;
  }

  if (!esFormatoValido) {
    this.loginValidado = false;
    alert("La contraseña debe contener al menos una letra mayúscula y una minúscula.");
    return;
  }

  const usuarioEncontrado = this.userList.find(u => 
    u.email === this.usuario.email && u.password === this.usuario.password
  );

  if (usuarioEncontrado) {
    localStorage.setItem('UsuarioLogeado', JSON.stringify(this.usuario.email));
    this.loginValidado = true;
    alert("¡Login exitoso!");
    this.router.navigate(['/dashboard']);
  } else {
    this.loginValidado = false;
    alert("Correo o contraseña incorrectos.");
  }
}

  loginValidado: boolean =true;
  router = inject(Router);


  validarLongitud (password:String):boolean{
    if(password.length>=8)
      return true;
    return false;
  }
  validarFormatoPassword(password: string): boolean {
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  return tieneMayuscula && tieneMinuscula;
  }
  
}
