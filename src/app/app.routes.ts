import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormularioComponent } from './formulario/formulario.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'formulario', component: FormularioComponent },  // Ruta para crear
  { path: 'formulario/:id', component: FormularioComponent } // Ruta para editar

];
