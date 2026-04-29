import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {

  email = "";
  password = "";
  erreur = "";
  chargement = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  connexion() {
    this.chargement = true;
    this.erreur = "";

    this.http.post<any>('https://assignment-app-back.onrender.com/login', {
      email: this.email,
      password: this.password
    }).subscribe({
     next: (res) => {
       localStorage.setItem('token', res.token);
       localStorage.setItem('user', res.user);

       this.router.navigate(['/dashboard']).then(() => {
        window.location.reload();
      });
   },
      error: () => {
        this.erreur = "Identifiants incorrects";
        this.chargement = false;
      }
    });
  }
}