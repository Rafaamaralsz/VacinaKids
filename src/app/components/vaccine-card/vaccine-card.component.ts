import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { Vaccine } from '../../models/vaccine.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-vaccine-card',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    DatePipe,
    StatusBadgeComponent,
  ],
  templateUrl: './vaccine-card.component.html',
  styleUrl: './vaccine-card.component.scss',
})
export class VaccineCardComponent {
  @Input({ required: true }) vaccine!: Vaccine;
}
