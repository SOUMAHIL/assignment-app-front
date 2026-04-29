import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    { nom: 'Angular' },
    { nom: 'Base de données' },
    { nom: 'Java' },
    { nom: 'Technologies Web' }
  ];

  editingId: string | null = null;
  nomModifie = '';

  page = 1;
  pageSize = 10;
  Math = Math; // ← ajoute cette ligne avec les autres propriétés

  API_URL = 'https://assignment-app-back.onrender.com/assignments';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (token) {
    this.estConnecte = true;
  }
  this.page = 1;
  this.getAssignments();
}


  // ==============================
  // GET ALL
  // ==============================
 // Remplace getAssignments
getAssignments() {
  this.loading = true;
  this.erreur = false;

  this.http.get<any[]>(this.API_URL).subscribe({
    next: (data) => {
      this.assignments = data;
      this.totalAssignments = data.length;
      this.totalRendus = data.filter(a => a.rendu).length;
      this.totalNonRendus = data.filter(a => !a.rendu).length;

      // ✅ Fix : on attend que assignments soit prêt
      setTimeout(() => {
        this.page = 1;
        this.updatePage();
        this.loading = false;
      }, 0);
    },
    error: (err) => {
      console.error('Erreur API :', err);
      this.erreur = true;
      this.loading = false;
    }
  });
}
// Ajoute ces 2 nouvelles méthodes
premierePage() {
  this.page = 1;
  this.updatePage();
}

dernierePage() {
  this.page = Math.ceil(this.assignments.length / this.pageSize);
  this.updatePage();
}
  // ==============================
  // PAGINATION
  // ==============================
  updatePage() {
    const debut = (this.page - 1) * this.pageSize;
    const fin = debut + this.pageSize;
    this.assignmentsPages = this.assignments.slice(debut, fin);
  }

  pagePrecedente() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  pageSuivante() {
    const maxPage = Math.ceil(this.assignments.length / this.pageSize);
    if (this.page < maxPage) {
      this.page++;
      this.updatePage();
    }
  }

  // ==============================
  // AUTH
  // ==============================
  ouvrirLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.estConnecte = false;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: 'Bearer ' + token }) };
  }

  // ==============================
  // AJOUTER
  // ==============================
  ajouterAssignment() {
    if (!this.nouvelAssignment || !this.auteur || !this.matiere) {
      alert('Remplis tous les champs obligatoires');
      return;
    }

    const body = {
      nom: this.nouvelAssignment,
      auteur: this.auteur,
      matiere: this.matiere,
      note: this.note,
      remarques: this.remarques,
      rendu: false
    };

    this.http.post(this.API_URL, body, this.getHeaders()).subscribe({
      next: () => {
        this.nouvelAssignment = '';
        this.auteur = '';
        this.matiere = '';
        this.note = 0;
        this.remarques = '';
        this.getAssignments();
      },
      error: (err) => {
        console.error('Erreur ajout :', err);
        alert('Erreur lors de l\'ajout');
      }
    });
  }

  // ==============================
  // TOGGLE RENDU
  // ==============================
  toggleRendu(a: any) {
    const body = { ...a, rendu: !a.rendu };

    this.http.put(this.API_URL + '/' + a._id, body, this.getHeaders()).subscribe({
      next: () => this.getAssignments(),
      error: (err) => console.error('Erreur toggle :', err)
    });
  }

  // ==============================
  // SUPPRIMER
  // ==============================
  supprimerAssignment(id: string) {
    if (!confirm('Supprimer cet assignment ?')) return;

    this.http.delete(this.API_URL + '/' + id, this.getHeaders()).subscribe({
      next: () => this.getAssignments(),
      error: (err) => console.error('Erreur suppression :', err)
    });
  }

  // ==============================
  // EDITION
  // ==============================
  commencerEdition(a: any) {
    this.editingId = a._id;
    this.nomModifie = a.nom;
  }

  sauvegarderEdition(a: any) {
    const body = { ...a, nom: this.nomModifie };

    this.http.put(this.API_URL + '/' + a._id, body, this.getHeaders()).subscribe({
      next: () => {
        this.editingId = null;
        this.getAssignments();
      },
      error: (err) => console.error('Erreur édition :', err)
    });
  }

  annulerEdition() {
    this.editingId = null;
  }

  // ==============================
  // EXPORT
  // ==============================
  exportPDF() {
    alert('Export PDF non implémenté');
  }

  exportExcel() {
    alert('Export Excel non implémenté');
  }
}