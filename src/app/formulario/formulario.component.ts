import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessmanService } from '../services/businessman.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private businessmanService = inject(BusinessmanService);

  form!: FormGroup;
  isEditing = false;
  businessmanId!: number;

  ngOnInit(): void {
    this.form = this.fb.group({
      bus_Name: ['', Validators.required],
      //bus_Phone_Number: ['', [Validators.pattern(/^\d+$/)]],
      bus_Email: ['', [Validators.required, Validators.email]],
      bus_Status: ['A', Validators.required,], 
      bus_Municipality: ['', Validators.required],

    });
  

    // Verificar si hay un ID en la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.businessmanId = +id;
        this.loadBusinessman(this.businessmanId);
      }
    });
  }

  private loadBusinessman(id: number): void {
    this.businessmanService.getBusinessmanById(id).subscribe(
      businessman => {
        this.form.patchValue({
          bus_Name: businessman.busName,
          bus_Phone_Number: businessman.busPhoneNumber,
          bus_Email: businessman.busEmail,
          bus_Status: businessman.busStatus, // Mantiene 'A' o 'I'
          bus_Municipality: businessman.busMunicipality.trim()
        });
      },
      error => {
        console.error('Error al cargar el comerciante:', error);
      }
    );
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const businessmanData = this.form.value;

    if (this.isEditing) {
      this.businessmanService.updateBusinessman(this.businessmanId, businessmanData).subscribe(() => {
        alert('Comerciante actualizado con éxito');
        this.router.navigate(['/home']);
      });
    } else {
      this.businessmanService.createBusinessman(businessmanData).subscribe(() => {
        alert('Comerciante registrado con éxito');
        this.router.navigate(['/home']);
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
