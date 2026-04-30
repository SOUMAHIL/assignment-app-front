import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assignment-detail.html',
  styleUrls: ['./assignment-detail.css']
})
export class AssignmentDetailComponent implements OnInit {

  assignment: any = null;
  loading = true;
  erreur = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.erreur = true;
      return;
    }

    this.http.get<any>('https://assignment-app-back.onrender.com/assignments/' + id)
      .subscribe({
        next: (data) => {
          this.assignment = data;
          this.loading = false;
          this.erreur = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('ERREUR DETAIL :', err);
          this.loading = false;
          this.erreur = true;
          this.cd.detectChanges();
        }
      });
  }

  retour() {
    this.router.navigate(['/dashboard']);
  }
}