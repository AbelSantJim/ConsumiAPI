import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';



@Component({
  selector: 'app-dashboard',
  imports: [MatPaginatorModule,MatInputModule,MatButtonModule, FormsModule,MatTableModule,MatCardModule,MatToolbarModule,MatButtonModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{
  personajesLista: MatTableDataSource<any> = new MatTableDataSource<any>([]); // ahora es un DataSource

  @ViewChild(MatPaginator) paginator!: MatPaginator;
    router = inject(Router);
    userList: any[]=[];
    http = inject(HttpClient);
    emailUsuarioLogeado: string = '';
    id: number = 1;
    nuevoNombre: string = '';
    nuevoGenero: string = '';
    nuevoCabello: string = '';
    nuevaEdad: string = '';

    ngOnInit(): void {
      const emailGuardado = localStorage.getItem('UsuarioLogeado');
      if (emailGuardado) {
      this.emailUsuarioLogeado = JSON.parse(emailGuardado);
      this.getUsuario();
      console.log(emailGuardado);
      this.getPersonajes();
      }
    }     
    getUsuario(){
      this.http.get("https://68743fcedd06792b9c937143.mockapi.io/api/users").subscribe((res:any) =>{
      const allUsers = res;
      this.userList = allUsers.filter((user: any) => user.email === this.emailUsuarioLogeado);
    })
    }
    getPersonajes(){
      this.http.get("https://bobsburgers-api.herokuapp.com/characters").subscribe((response: any) => {
      this.personajesLista = new MatTableDataSource<any>(response);
      this.personajesLista.paginator = this.paginator; 
      console.log("Personajes de la lista:", this.personajesLista);
    });
  }
  eliminarPersonaje() {
  const idStr = String(this.id); 
    this.personajesLista.data = this.personajesLista.data.filter(p => String(p.id) !== idStr);
  if (!this.id) {
    alert("Por favor, ingresa un ID válido");
    return;
  }

  const nuevaLista = this.personajesLista.data.filter(item => item.id !== this.id);
  this.personajesLista.data = nuevaLista;

  alert(`Personaje con ID ${this.id} eliminado de la tabla.`);
  this.id = 0; 
}
editarPersonaje() {
  if (!this.id) {
    alert("Por favor, ingresa un ID válido");
    return;
  }
  const index = this.personajesLista.data.findIndex(p => String(p.id) === String(this.id));

  if (index === -1) {
    alert("Personaje no encontrado.");
    return;
  }

  const personaje = this.personajesLista.data[index];

  if (this.nuevoNombre) personaje.name = this.nuevoNombre;
  if (this.nuevoGenero) personaje.gender = this.nuevoGenero;
  if (this.nuevoCabello) personaje.hair = this.nuevoCabello;
  if (this.nuevaEdad) personaje.age = this.nuevaEdad;

  this.personajesLista.data = [...this.personajesLista.data];

  alert(`Personaje con ID ${this.id} actualizado.`);

  this.id = 0;
  this.nuevoNombre = '';
  this.nuevoGenero = '';
  this.nuevoCabello = '';
  this.nuevaEdad = '';
}



}