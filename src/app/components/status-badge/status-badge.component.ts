import { Component, Input } from '@angular/core';
import { IonBadge } from '@ionic/angular/standalone';
import { VaccineStatus } from '../../models/vaccine.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [IonBadge],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: VaccineStatus;

  get color(): string {
    switch (this.status) {
      case 'Aplicada':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Atrasada':
        return 'danger';
    }
  }
}
