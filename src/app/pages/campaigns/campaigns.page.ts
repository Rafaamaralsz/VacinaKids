import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { map, Observable } from 'rxjs';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';
import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CampaignCardComponent,
  ],
  templateUrl: './campaigns.page.html',
  styleUrl: './campaigns.page.scss',
})
export class CampaignsPage implements OnInit {
  private readonly campaignService = inject(CampaignService);

  campaigns$!: Observable<Campaign[]>;
  showActiveOnly = true;

  ngOnInit(): void {
    this.loadCampaigns();
  }

  onFilterChange(event: CustomEvent): void {
    this.showActiveOnly = event.detail.value === 'ativas';
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.campaigns$ = this.showActiveOnly
      ? this.campaignService.getActive()
      : this.campaignService.getAll().pipe(
          map((campaigns) =>
            [...campaigns].sort((a, b) => Number(b.isCurrentlyActive) - Number(a.isCurrentlyActive))
          )
        );
  }
}
