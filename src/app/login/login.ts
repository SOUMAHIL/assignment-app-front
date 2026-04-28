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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  connexion() {

    this.http.post<any>('http://localhost:3000/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.user);

        this.router.navigate(['/']);
      },

      error: () => {
        this.erreur = "Identifiants incorrects";
      }
    });
  }

}