import { Component, Input } from '@angular/core';
import { IonProgressBar, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-progress-vaccination',
  standalone: true,
  imports: [IonProgressBar, IonText],
  templateUrl: './progress-vaccination.component.html',
  styleUrl: './progress-vaccination.component.scss',
})
export class ProgressVaccinationComponent {
  @Input() percentual = 0;
  @Input() aplicadas = 0;
  @Input() pendentes = 0;
  @Input() showDetails = true;
  @Input() label = 'Progresso vacinal';

  get progressValue(): number {
    return this.percentual / 100;
  }
}
