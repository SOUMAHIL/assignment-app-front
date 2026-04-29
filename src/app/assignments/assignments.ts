import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class AssignmentsComponent implements OnInit {

  assignments: any[] = [];
  loading = true;
  erreur = false;

  // 🔥 URL de ton backend
  API_URL = 'https://assignment-app-back.onrender.com/api/assignments';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAssignments();
  }

  getAssignments() {
    this.http.get<any[]>(this.API_URL)
      .subscribe({
        next: (data) => {
          console.log("LISTE OK :", data);
          this.assignments = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.erreur = true;
        }
      });
  }

}