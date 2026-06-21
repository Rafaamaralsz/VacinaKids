import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  checkmarkCircleOutline,
  timeOutline,
  alertCircleOutline,
  megaphoneOutline,
} from 'ionicons/icons';
import { combineLatest, map, Observable } from 'rxjs';
import { ChildService } from '../../services/child.service';
import { VaccineService, DashboardStats } from '../../services/vaccine.service';
import { CampaignService } from '../../services/campaign.service';
import { ProgressVaccinationComponent } from '../../components/progress-vaccination/progress-vaccination.component';
import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    ProgressVaccinationComponent,
    CampaignCardComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly childService = inject(ChildService);
  private readonly vaccineService = inject(VaccineService);
  private readonly campaignService = inject(CampaignService);

  stats$!: Observable<DashboardStats>;
  activeCampaigns$!: Observable<Campaign[]>;

  constructor() {
    addIcons({
      peopleOutline,
      checkmarkCircleOutline,
      timeOutline,
      alertCircleOutline,
      megaphoneOutline,
    });
  }

  ngOnInit(): void {
    this.stats$ = combineLatest([
      this.childService.getCount(),
      this.campaignService.getActiveCount(),
      this.vaccineService.getAll(),
    ]).pipe(
      map(([totalCriancas, campanhasAtivas, vaccines]) => {
        const total = vaccines.length;
        const aplicadas = vaccines.filter((v) => v.status === 'Aplicada').length;
        const pendentes = vaccines.filter((v) => v.status === 'Pendente').length;
        const atrasadas = vaccines.filter((v) => v.status === 'Atrasada').length;
        const percentual = total > 0 ? Math.round((aplicadas / total) * 100) : 0;

        return { totalCriancas, campanhasAtivas, total, aplicadas, pendentes, atrasadas, percentual };
      })
    );

    this.activeCampaigns$ = this.campaignService.getActive();
  }
}
