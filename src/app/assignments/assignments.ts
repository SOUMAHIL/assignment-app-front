import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 🔥 IMPORTANT

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class AssignmentsComponent implements OnInit {

  assignments: any[] = [];
  assignmentsPages: any[] = [];

  loading = true;
  erreur = false;

  // 🔥 VARIABLES MANQUANTES
  estConnecte = false;

  totalAssignments = 0;
  totalRendus = 0;
  totalNonRendus = 0;

  nouvelAssignment = '';
  auteur = '';
  matiere = '';
  note = 0;
  remarques = '';
  searchText = '';

  matieres = [
    { nom: 'Web' },
    { nom: 'Java' }
  ];

  editingId: string | null = null;
  nomModifie = '';

  page = 1;

  API_URL = 'https://assignment-app-back.onrender.com/assignments';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAssignments();
  }

  getAssignments() {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.assignments = data;
        this.assignmentsPages = data;

        this.totalAssignments = data.length;
        this.totalRendus = data.filter(a => a.rendu).length;
        this.totalNonRendus = data.filter(a => !a.rendu).length;

        this.loading = false;
      },
      error: () => {
        this.erreur = true;
        this.loading = false;
      }
    });
  }

  // 🔥 FONCTIONS VIDES (pour éviter crash)

  ouvrirLogin() {
    alert('Login non implémenté');
  }

  logout() {
    this.estConnecte = false;
  }

  ajouterAssignment() {
    alert('Ajout non implémenté');
  }

  toggleRendu(a: any) {
    a.rendu = !a.rendu;
  }

  supprimerAssignment(id: string) {
    this.assignments = this.assignments.filter(a => a._id !== id);
    this.assignmentsPages = this.assignments;
  }

  commencerEdition(a: any) {
    this.editingId = a._id;
    this.nomModifie = a.nom;
  }

  sauvegarderEdition(a: any) {
    a.nom = this.nomModifie;
    this.editingId = null;
  }

  annulerEdition() {
    this.editingId = null;
  }

  pagePrecedente() {
    if (this.page > 1) this.page--;
  }

  pageSuivante() {
    this.page++;
  }

  exportPDF() {
    alert('PDF non implémenté');
  }

  exportExcel() {
    alert('Excel non implémenté');
  }
}