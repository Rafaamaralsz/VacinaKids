import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
  medkitOutline,
  calendarOutline,
} from 'ionicons/icons';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { ChildService } from '../../services/child.service';
import { VaccineService, VaccinationStats } from '../../services/vaccine.service';
import { Child } from '../../models/child.model';
import { ProgressVaccinationComponent } from '../../components/progress-vaccination/progress-vaccination.component';
import { VaccineCardComponent } from '../../components/vaccine-card/vaccine-card.component';
import { Vaccine } from '../../models/vaccine.model';

@Component({
  selector: 'app-child-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    ProgressVaccinationComponent,
    VaccineCardComponent,
  ],
  templateUrl: './child-detail.page.html',
  styleUrl: './child-detail.page.scss',
})
export class ChildDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly childService = inject(ChildService);
  private readonly vaccineService = inject(VaccineService);
  private readonly alertController = inject(AlertController);

  child$!: Observable<Child | undefined>;
  stats$!: Observable<VaccinationStats>;
  vaccines$!: Observable<Vaccine[]>;

  constructor() {
    addIcons({ createOutline, trashOutline, medkitOutline, calendarOutline });
  }

  ngOnInit(): void {
    const childId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

    this.child$ = childId$.pipe(switchMap((id) => this.childService.getById(id)));

    this.stats$ = childId$.pipe(switchMap((id) => this.vaccineService.getStatsByChildId(id)));

    this.vaccines$ = childId$.pipe(switchMap((id) => this.vaccineService.getByChildId(id)));
  }

  async confirmDelete(child: Child): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remover criança',
      message: `Deseja remover ${child.nome}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            this.vaccineService.removeByChildId(child.id);
            this.childService.remove(child.id).subscribe(() => {
              this.router.navigate(['/criancas']);
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
