import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './assignments.html'
})
export class Assignments implements OnInit {

  assignments: any[] = [];

  // =====================
  // AUTH
  // =====================
  estConnecte = false;
  token = '';

  // =====================
  // FORMULAIRE
  // =====================
  nouvelAssignment = '';
  auteur = '';
  matiere = '';
  note = 0;
  remarques = '';
  searchText = '';

  // =====================
  // EDITION
  // =====================
  editingId: string | null = null;
  nomModifie = '';

  // =====================
  // PAGINATION
  // =====================
  page = 1;
  itemsParPage = 10;

  // =====================
  // MATIERES
  // =====================
  matieres = [

    {
      nom: 'Angular',
      prof: 'Michel Buffa',
      image: 'https://angular.io/assets/images/logos/angular/angular.png'
    },

    {
      nom: 'Base de données',
      prof: 'Mme SQL',
      image: 'https://cdn-icons-png.flaticon.com/512/4248/4248443.png'
    },

    {
      nom: 'Technologies Web',
      prof: 'M. Web',
      image: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
    },

    {
      nom: 'Java',
      prof: 'M. Java',
      image: 'https://cdn-icons-png.flaticon.com/512/226/226777.png'
    }

  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  // =====================
  // INIT
  // =====================
  ngOnInit(): void {

    this.chargerAssignments();

    const tokenLocal = localStorage.getItem('token');

    if (tokenLocal) {
      this.token = tokenLocal;
      this.estConnecte = true;
    }

  }

  // =====================
  // TOKEN HEADER
  // =====================
  getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
  }

  // =====================
  // LOGIN
  // =====================
  ouvrirLogin() {

    const email = prompt('Email Admin :');
    if (!email) return;

    const password = prompt('Mot de passe :');
    if (!password) return;

    this.http.post<any>(
      'http://localhost:3000/login',
      { email, password }
    ).subscribe({

      next: (res) => {

        this.token = res.token;
        this.estConnecte = true;

        localStorage.setItem('token', this.token);

        this.toastr.success('Connexion réussie ✅');

      },

      error: () => {
        this.toastr.error('Identifiants incorrects');
      }

    });

  }

  // =====================
  // LOGOUT
  // =====================
  logout() {

    this.estConnecte = false;
    this.token = '';

    localStorage.removeItem('token');

    this.toastr.info('Déconnecté');

  }

  // =====================
  // LOAD
  // =====================
  chargerAssignments() {

    this.http.get<any[]>(
      'http://localhost:3000/assignments'
    ).subscribe({

      next: (data) => {

        this.assignments = data;
        this.cdr.detectChanges();

      },

      error: () => {
        this.toastr.error('Erreur chargement');
      }

    });

  }

  // =====================
  // RECHERCHE
  // =====================
  get assignmentsFiltres() {

    return this.assignments.filter(a =>

      a.nom.toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      (a.auteur || '')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      (a.matiere || '')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  // =====================
  // PAGINATION
  // =====================
  get assignmentsPages() {

    const debut =
      (this.page - 1) * this.itemsParPage;

    const fin =
      debut + this.itemsParPage;

    return this.assignmentsFiltres.slice(
      debut,
      fin
    );

  }

  pageSuivante() {

    if (
      this.page * this.itemsParPage <
      this.assignmentsFiltres.length
    ) {
      this.page++;
    }

  }

  pagePrecedente() {

    if (this.page > 1) {
      this.page--;
    }

  }

  // =====================
  // STATS
  // =====================
  get totalAssignments() {
    return this.assignments.length;
  }

  get totalRendus() {
    return this.assignments.filter(a => a.rendu).length;
  }

  get totalNonRendus() {
    return this.assignments.filter(a => !a.rendu).length;
  }

  // =====================
  // AJOUT
  // =====================
  ajouterAssignment() {

    if (!this.estConnecte) {
      this.toastr.warning('Connexion admin requise');
      return;
    }

    if (!this.nouvelAssignment.trim()) return;

    const m =
      this.matieres.find(
        x => x.nom === this.matiere
      );

    const nouveau = {

      nom: this.nouvelAssignment,
      rendu: false,

      auteur: this.auteur,
      matiere: this.matiere,
      note: this.note,
      remarques: this.remarques,

      prof: m?.prof || '',
      image: m?.image || ''

    };

    this.http.post(
      'http://localhost:3000/assignments',
      nouveau,
      this.getHeaders()
    ).subscribe({

      next: () => {

        this.nouvelAssignment = '';
        this.auteur = '';
        this.matiere = '';
        this.note = 0;
        this.remarques = '';

        this.chargerAssignments();

        this.toastr.success(
          'Assignment ajouté ✅'
        );

      },

      error: () => {
        this.toastr.error('Erreur ajout');
      }

    });

  }

  // =====================
  // DELETE
  // =====================
  supprimerAssignment(id: string) {

    if (!confirm('Supprimer cet assignment ?')) {
      return;
    }

    this.http.delete(
      `http://localhost:3000/assignments/${id}`,
      this.getHeaders()
    ).subscribe({

      next: () => {

        this.chargerAssignments();

        this.toastr.success('Supprimé');

      },

      error: () => {
        this.toastr.error('Erreur suppression');
      }

    });

  }

  // =====================
  // TOGGLE RENDU
  // =====================
  toggleRendu(a: any) {

    if (!a.note || a.note <= 0) {
      this.toastr.warning(
        'Impossible de rendre sans note'
      );
      return;
    }

    this.http.put(
      `http://localhost:3000/assignments/${a._id}`,
      {
        ...a,
        rendu: !a.rendu
      },
      this.getHeaders()
    ).subscribe({

      next: () => {

        this.chargerAssignments();

        this.toastr.success(
          'Statut modifié'
        );

      },

      error: () => {
        this.toastr.error(
          'Erreur modification'
        );
      }

    });

  }

  // =====================
  // EDITION
  // =====================
  commencerEdition(a: any) {

    this.editingId = a._id;
    this.nomModifie = a.nom;

  }

  sauvegarderEdition(a: any) {

    this.http.put(
      `http://localhost:3000/assignments/${a._id}`,
      {
        ...a,
        nom: this.nomModifie
      },
      this.getHeaders()
    ).subscribe({

      next: () => {

        this.editingId = null;
        this.nomModifie = '';

        this.chargerAssignments();

        this.toastr.success('Modifié');

      },

      error: () => {
        this.toastr.error(
          'Erreur modification'
        );
      }

    });

  }

  annulerEdition() {

    this.editingId = null;
    this.nomModifie = '';

  }

  // =====================
  // EXPORT PDF
  // =====================
  exportPDF() {

    const doc = new jsPDF();

    doc.text(
      'Liste des Assignments',
      14,
      15
    );

    autoTable(doc, {
      head: [[
        'Nom',
        'Auteur',
        'Matière',
        'Note',
        'Statut'
      ]],
      body: this.assignments.map(a => [
        a.nom,
        a.auteur,
        a.matiere,
        a.note,
        a.rendu ? 'Rendu' : 'Non rendu'
      ])
    });

    doc.save('assignments.pdf');

    this.toastr.success('PDF exporté');

  }

  // =====================
  // EXPORT EXCEL
  // =====================
  exportExcel() {

    const data =
      this.assignments.map(a => ({

        Nom: a.nom,
        Auteur: a.auteur,
        Matiere: a.matiere,
        Prof: a.prof,
        Note: a.note,
        Statut:
          a.rendu ? 'Rendu' : 'Non rendu'

      }));

    const ws =
      XLSX.utils.json_to_sheet(data);

    const wb = {
      Sheets: { data: ws },
      SheetNames: ['data']
    };

    const buffer =
      XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
      });

    const file = new Blob(
      [buffer],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      }
    );

    saveAs(file, 'assignments.xlsx');

    this.toastr.success('Excel exporté');

  }

}