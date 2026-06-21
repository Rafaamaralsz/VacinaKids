import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonNote,
  ToastController,
} from '@ionic/angular/standalone';
import { ChildService } from '../../services/child.service';
import { Child } from '../../models/child.model';

@Component({
  selector: 'app-child-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonNote,
  ],
  templateUrl: './child-form.page.html',
  styleUrl: './child-form.page.scss',
})
export class ChildFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly childService = inject(ChildService);
  private readonly toastController = inject(ToastController);

  isEditMode = false;
  childId: string | null = null;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    dataNascimento: ['', Validators.required],
  });

  ngOnInit(): void {
    this.childId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.childId !== null && this.childId !== 'nova';

    if (this.isEditMode && this.childId) {
      this.childService.getById(this.childId).subscribe((child) => {
        if (child) {
          this.form.patchValue({
            nome: child.nome,
            dataNascimento: child.dataNascimento,
          });
        }
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, dataNascimento } = this.form.getRawValue();

    if (this.isEditMode && this.childId) {
      const child = new Child({
        id: this.childId,
        nome: nome!,
        dataNascimento: dataNascimento!,
      });

      this.childService.update(child).subscribe(async () => {
        await this.showToast('Criança atualizada com sucesso!');
        this.router.navigate(['/criancas', child.id]);
      });
    } else {
      const child = new Child({
        id: this.childService.generateId(),
        nome: nome!,
        dataNascimento: dataNascimento!,
      });

      this.childService.add(child).subscribe(async () => {
        await this.showToast('Criança cadastrada com sucesso!');
        this.router.navigate(['/criancas']);
      });
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }
}
