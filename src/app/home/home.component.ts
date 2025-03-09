import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessmanService } from '../services/businessman.service';
import { AuthService } from '../auth.service';
import { Businessman } from '../models/businessman.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  businessmen: Businessman[] = [];
  isAdmin = false;
  page = 1;
  pageSize = 5;

  constructor(
    private businessmanService: BusinessmanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBusinessmen();
    this.isAdmin = this.authService.getUserRole() === 'Administrador';
  }

  loadBusinessmen(): void {
    this.businessmanService.getBusinessmen(this.page, this.pageSize).subscribe((data) => {
      this.businessmen = data;
    });
  }

  editBusinessman(id: number): void {
    this.router.navigate(['/formulario', id]);
  }

  toggleStatus(id: number, currentStatus: string): void {
    const newStatus = currentStatus === 'A' ? 'I' : 'A';
    this.businessmanService.updateStatus(id, newStatus).subscribe(() => {
      this.loadBusinessmen();
    });
  }

  deleteBusinessman(id: number): void {
    if (confirm('¿Estás seguro de eliminar este comerciante?')) {
      this.businessmanService.deleteBusinessman(id).subscribe(() => {
        this.loadBusinessmen();
      });
    }
  }

  downloadReport(): void {
    this.businessmanService.downloadReport();
  }

  navigateToForm(): void {
    this.router.navigate(['/formulario']);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadBusinessmen();
    }
  }

  nextPage(): void {
    this.page++;
    this.loadBusinessmen();
  }

  logout() {
    this.authService.logout();
  }
}
