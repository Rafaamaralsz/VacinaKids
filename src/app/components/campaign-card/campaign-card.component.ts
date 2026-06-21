import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { megaphoneOutline, calendarOutline, peopleOutline } from 'ionicons/icons';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonIcon,
    DatePipe,
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
})
export class CampaignCardComponent {
  @Input({ required: true }) campaign!: Campaign;
  @Input() featured = false;

  constructor() {
    addIcons({ megaphoneOutline, calendarOutline, peopleOutline });
  }
}
