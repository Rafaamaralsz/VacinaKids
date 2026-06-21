import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, chevronForwardOutline } from 'ionicons/icons';
import { Child } from '../../models/child.model';
import { ProgressVaccinationComponent } from '../progress-vaccination/progress-vaccination.component';

@Component({
  selector: 'app-child-card',
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonButton,
    RouterLink,
    ProgressVaccinationComponent,
  ],
  templateUrl: './child-card.component.html',
  styleUrl: './child-card.component.scss',
})
export class ChildCardComponent {
  @Input({ required: true }) child!: Child;
  @Input() percentual = 0;
  @Input() aplicadas = 0;
  @Input() pendentes = 0;

  constructor() {
    addIcons({ personOutline, chevronForwardOutline });
  }
}
