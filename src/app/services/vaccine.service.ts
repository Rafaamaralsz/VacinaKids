import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest, map, of, tap } from 'rxjs';
import { Vaccine, IVaccine } from '../models/vaccine.model';
import { VaccineStatus } from '../models/vaccine.model';
import { MOCK_VACCINES } from '../data/mock-data';
import { environment } from '../../environments/environment';

export interface VaccinationStats {
  total: number;
  aplicadas: number;
  pendentes: number;
  atrasadas: number;
  percentual: number;
}

export interface DashboardStats extends VaccinationStats {
  totalCriancas: number;
  campanhasAtivas: number;
}

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly vaccinesSubject = new BehaviorSubject<Vaccine[]>([]);
  readonly vaccines$ = this.vaccinesSubject.asObservable();

  constructor() {
    this.loadVaccines();
  }

  private loadVaccines(): void {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'vaccines');
      collectionData(ref, { idField: 'id' }).subscribe((data) => {
        const vaccines = (data as IVaccine[]).map((item) => Vaccine.fromFirestore(item));
        this.vaccinesSubject.next(vaccines);
      });
    } else {
      const vaccines = MOCK_VACCINES.map((item) => new Vaccine(item));
      this.vaccinesSubject.next(vaccines);
    }
  }

  getAll(): Observable<Vaccine[]> {
    return this.vaccines$;
  }

  getByChildId(childId: string): Observable<Vaccine[]> {
    return this.vaccines$.pipe(
      map((vaccines) => vaccines.filter((v) => v.childId === childId))
    );
  }

  getStatsByChildId(childId: string): Observable<VaccinationStats> {
    return this.getByChildId(childId).pipe(map((vaccines) => this.calculateStats(vaccines)));
  }

  getGlobalStats(totalCriancas: number, campanhasAtivas: number): Observable<DashboardStats> {
    return this.vaccines$.pipe(
      map((vaccines) => {
        const stats = this.calculateStats(vaccines);
        return {
          ...stats,
          totalCriancas,
          campanhasAtivas,
        };
      })
    );
  }

  getByStatus(status: VaccineStatus): Observable<Vaccine[]> {
    return this.vaccines$.pipe(map((vaccines) => vaccines.filter((v) => v.status === status)));
  }

  add(vaccine: Vaccine): Observable<Vaccine> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'vaccines', vaccine.id);
      return new Observable<Vaccine>((observer) => {
        setDoc(ref, vaccine.toFirestore())
          .then(() => {
            const current = this.vaccinesSubject.value;
            this.vaccinesSubject.next([...current, vaccine]);
            observer.next(vaccine);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const current = this.vaccinesSubject.value;
    this.vaccinesSubject.next([...current, vaccine]);
    return of(vaccine);
  }

  update(vaccine: Vaccine): Observable<Vaccine> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'vaccines', vaccine.id);
      return new Observable<Vaccine>((observer) => {
        setDoc(ref, vaccine.toFirestore())
          .then(() => {
            const updated = this.vaccinesSubject.value.map((v) =>
              v.id === vaccine.id ? vaccine : v
            );
            this.vaccinesSubject.next(updated);
            observer.next(vaccine);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const updated = this.vaccinesSubject.value.map((v) => (v.id === vaccine.id ? vaccine : v));
    this.vaccinesSubject.next(updated);
    return of(vaccine);
  }

  remove(id: string): Observable<void> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'vaccines', id);
      return new Observable<void>((observer) => {
        deleteDoc(ref)
          .then(() => {
            const filtered = this.vaccinesSubject.value.filter((v) => v.id !== id);
            this.vaccinesSubject.next(filtered);
            observer.next();
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const filtered = this.vaccinesSubject.value.filter((v) => v.id !== id);
    this.vaccinesSubject.next(filtered);
    return of(undefined).pipe(tap(() => void 0));
  }

  removeByChildId(childId: string): void {
    const filtered = this.vaccinesSubject.value.filter((v) => v.childId !== childId);
    this.vaccinesSubject.next(filtered);
  }

  private calculateStats(vaccines: Vaccine[]): VaccinationStats {
    const total = vaccines.length;
    const aplicadas = vaccines.filter((v) => v.status === 'Aplicada').length;
    const pendentes = vaccines.filter((v) => v.status === 'Pendente').length;
    const atrasadas = vaccines.filter((v) => v.status === 'Atrasada').length;
    const percentual = total > 0 ? Math.round((aplicadas / total) * 100) : 0;

    return { total, aplicadas, pendentes, atrasadas, percentual };
  }

  generateId(): string {
    return `vac-${Date.now()}`;
  }
}
