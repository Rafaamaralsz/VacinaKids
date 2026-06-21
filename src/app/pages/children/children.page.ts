import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { combineLatest, map, Observable } from 'rxjs';
import { ChildService } from '../../services/child.service';
import { VaccineService } from '../../services/vaccine.service';
import { ChildCardComponent } from '../../components/child-card/child-card.component';
import { Child } from '../../models/child.model';

interface ChildWithStats {
  child: Child;
  percentual: number;
  aplicadas: number;
  pendentes: number;
}

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    ChildCardComponent,
  ],
  templateUrl: './children.page.html',
  styleUrl: './children.page.scss',
})
export class ChildrenPage implements OnInit {
  private readonly childService = inject(ChildService);
  private readonly vaccineService = inject(VaccineService);

  childrenWithStats$!: Observable<ChildWithStats[]>;

  constructor() {
    addIcons({ addOutline });
  }

  ngOnInit(): void {
    this.childrenWithStats$ = combineLatest([
      this.childService.getAll(),
      this.vaccineService.getAll(),
    ]).pipe(
      map(([children, vaccines]) =>
        children.map((child) => {
          const childVaccines = vaccines.filter((v) => v.childId === child.id);
          const total = childVaccines.length;
          const aplicadas = childVaccines.filter((v) => v.status === 'Aplicada').length;
          const pendentes = childVaccines.filter(
            (v) => v.status === 'Pendente' || v.status === 'Atrasada'
          ).length;
          const percentual = total > 0 ? Math.round((aplicadas / total) * 100) : 0;

          return { child, percentual, aplicadas, pendentes };
        })
      )
    );
  }
}
