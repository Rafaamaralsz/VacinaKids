import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonChip,
} from '@ionic/angular/standalone';
import { map, Observable, switchMap } from 'rxjs';
import { ChildService } from '../../services/child.service';
import { VaccineService } from '../../services/vaccine.service';
import { Child } from '../../models/child.model';
import { Vaccine, VaccineStatus } from '../../models/vaccine.model';
import { VaccineCardComponent } from '../../components/vaccine-card/vaccine-card.component';

@Component({
  selector: 'app-vaccine-history',
  standalone: true,
  imports: [
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonChip,
    VaccineCardComponent,
  ],
  templateUrl: './vaccine-history.page.html',
  styleUrl: './vaccine-history.page.scss',
})
export class VaccineHistoryPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly childService = inject(ChildService);
  private readonly vaccineService = inject(VaccineService);

  child$!: Observable<Child | undefined>;
  allVaccines$!: Observable<Vaccine[]>;
  filteredVaccines$!: Observable<Vaccine[]>;

  selectedFilter: VaccineStatus | 'Todas' = 'Todas';

  ngOnInit(): void {
    const childId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

    this.child$ = childId$.pipe(switchMap((id) => this.childService.getById(id)));

    this.allVaccines$ = childId$.pipe(switchMap((id) => this.vaccineService.getByChildId(id)));

    this.applyFilter();
  }

  onFilterChange(event: CustomEvent): void {
    this.selectedFilter = event.detail.value as VaccineStatus | 'Todas';
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredVaccines$ = this.allVaccines$.pipe(
      map((vaccines) => {
        if (this.selectedFilter === 'Todas') {
          return vaccines;
        }
        return vaccines.filter((v) => v.status === this.selectedFilter);
      })
    );
  }
}
