import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Campaign, ICampaign } from '../models/campaign.model';
import { MOCK_CAMPAIGNS } from '../data/mock-data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly campaignsSubject = new BehaviorSubject<Campaign[]>([]);
  readonly campaigns$ = this.campaignsSubject.asObservable();

  constructor() {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'campaigns');
      collectionData(ref, { idField: 'id' }).subscribe((data) => {
        const campaigns = (data as ICampaign[]).map((item) => Campaign.fromFirestore(item));
        this.campaignsSubject.next(campaigns);
      });
    } else {
      const campaigns = MOCK_CAMPAIGNS.map((item) => new Campaign(item));
      this.campaignsSubject.next(campaigns);
    }
  }

  getAll(): Observable<Campaign[]> {
    return this.campaigns$;
  }

  getActive(): Observable<Campaign[]> {
    return this.campaigns$.pipe(
      map((campaigns) => campaigns.filter((c) => c.isCurrentlyActive))
    );
  }

  getActiveCount(): Observable<number> {
    return this.getActive().pipe(map((campaigns) => campaigns.length));
  }

  getById(id: string): Observable<Campaign | undefined> {
    return this.campaigns$.pipe(map((campaigns) => campaigns.find((c) => c.id === id)));
  }

  add(campaign: Campaign): Observable<Campaign> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'campaigns', campaign.id);
      return new Observable<Campaign>((observer) => {
        setDoc(ref, campaign.toFirestore())
          .then(() => {
            const current = this.campaignsSubject.value;
            this.campaignsSubject.next([...current, campaign]);
            observer.next(campaign);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const current = this.campaignsSubject.value;
    this.campaignsSubject.next([...current, campaign]);
    return of(campaign);
  }

  update(campaign: Campaign): Observable<Campaign> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'campaigns', campaign.id);
      return new Observable<Campaign>((observer) => {
        setDoc(ref, campaign.toFirestore())
          .then(() => {
            const updated = this.campaignsSubject.value.map((c) =>
              c.id === campaign.id ? campaign : c
            );
            this.campaignsSubject.next(updated);
            observer.next(campaign);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const updated = this.campaignsSubject.value.map((c) =>
      c.id === campaign.id ? campaign : c
    );
    this.campaignsSubject.next(updated);
    return of(campaign);
  }

  remove(id: string): Observable<void> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'campaigns', id);
      return new Observable<void>((observer) => {
        deleteDoc(ref)
          .then(() => {
            const filtered = this.campaignsSubject.value.filter((c) => c.id !== id);
            this.campaignsSubject.next(filtered);
            observer.next();
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const filtered = this.campaignsSubject.value.filter((c) => c.id !== id);
    this.campaignsSubject.next(filtered);
    return of(undefined).pipe(tap(() => void 0));
  }

  generateId(): string {
    return `camp-${Date.now()}`;
  }
}
