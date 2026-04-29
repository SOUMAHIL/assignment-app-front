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
  image = '';
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
  Math = Math;

  API_URL = 'https://assignment-app-back.onrender.com/assignments';

  constructor(private http: HttpClient, private router: Router) {}

  // ==============================
  // INIT
  // ==============================
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.estConnecte = !!token;
    this.page = 1;
    this.getAssignments();
  }

  // ==============================
  // GET ALL
  // ==============================
  getAssignments() {
    this.loading = true;
    this.erreur = false;

    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.assignments = data;
        this.totalRendus = data.filter(a => a.rendu).length;
        this.totalNonRendus = data.filter(a => !a.rendu).length;
        this.page = 1;
        this.updatePage();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.erreur = true;
        this.loading = false;
      }
    });
  }

  // ==============================
  // PAGINATION + RECHERCHE
  // ==============================
  updatePage() {
    const filtered = this.assignments.filter(a =>
      !this.searchText ||
      a.nom?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.auteur?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      a.matiere?.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.totalAssignments = filtered.length;
    const debut = (this.page - 1) * this.pageSize;
    this.assignmentsPages = filtered.slice(debut, debut + this.pageSize);
  }

  onSearch() {
    this.page = 1;
    this.updatePage();
  }

  premierePage() {
    this.page = 1;
    this.updatePage();
  }

  pagePrecedente() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  pageSuivante() {
    const maxPage = Math.ceil(this.totalAssignments / this.pageSize);
    if (this.page < maxPage) {
      this.page++;
      this.updatePage();
    }
  }

  dernierePage() {
    this.page = Math.ceil(this.totalAssignments / this.pageSize);
    this.updatePage();
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
    this.router.navigate(['/login']);
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
      image: this.image,
      rendu: false
    };

    this.http.post(this.API_URL, body, this.getHeaders()).subscribe({
      next: () => {
        this.nouvelAssignment = '';
        this.auteur = '';
        this.matiere = '';
        this.note = 0;
        this.remarques = '';
        this.image = '';
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
  // EXPORT PDF
  // ==============================
  exportPDF() {
    const doc = document.createElement('div');
    doc.innerHTML = `
      <h2>Assignment Manager — Export PDF</h2>
      <p>Total: ${this.assignments.length} | Rendus: ${this.totalRendus} | Non rendus: ${this.totalNonRendus}</p>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#222;color:#fff">
            <th>Nom</th><th>Auteur</th><th>Matière</th><th>Prof</th><th>Note</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${this.assignments.map(a => `
            <tr>
              <td>${a.nom}</td>
              <td>${a.auteur}</td>
              <td>${a.matiere}</td>
              <td>${a.prof}</td>
              <td>${a.note}/20</td>
              <td>${a.rendu ? 'Rendu' : 'Non rendu'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Export PDF</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
              th { background: #222; color: #fff; }
              tr:nth-child(even) { background: #f5f5f5; }
            </style>
          </head>
          <body>${doc.innerHTML}</body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  }

  // ==============================
  // EXPORT EXCEL
  // ==============================
  exportExcel() {
    const lignes = [
      ['Nom', 'Auteur', 'Matière', 'Prof', 'Note', 'Statut'],
      ...this.assignments.map(a => [
        a.nom,
        a.auteur,
        a.matiere,
        a.prof,
        a.note + '/20',
        a.rendu ? 'Rendu' : 'Non rendu'
      ])
    ];

    const contenu = lignes.map(l => l.join('\t')).join('\n');
    const blob = new Blob([contenu], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignments.xls';
    a.click();
    URL.revokeObjectURL(url);
  }
}