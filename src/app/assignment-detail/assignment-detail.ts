import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.erreur = true;
      return;
    }

    this.http.get<any>('http://localhost:3000/assignments/' + id)
      .subscribe((data) => {

        console.log("DETAIL OK :", data);

        this.assignment = data;
        this.loading = false;
        this.erreur = false;

        this.cd.detectChanges(); // 🔥 force affichage

      }, (err) => {

        console.log(err);

        this.loading = false;
        this.erreur = true;

        this.cd.detectChanges();
      });

  }

}