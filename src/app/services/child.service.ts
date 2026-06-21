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
import { Child, IChild } from '../models/child.model';
import { MOCK_CHILDREN } from '../data/mock-data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly childrenSubject = new BehaviorSubject<Child[]>([]);
  readonly children$ = this.childrenSubject.asObservable();

  constructor() {
    this.loadChildren();
  }

  private loadChildren(): void {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'children');
      collectionData(ref, { idField: 'id' }).subscribe((data) => {
        const children = (data as IChild[]).map((item) => Child.fromFirestore(item));
        this.childrenSubject.next(children);
      });
    } else {
      const children = MOCK_CHILDREN.map((item) => new Child(item));
      this.childrenSubject.next(children);
    }
  }

  getAll(): Observable<Child[]> {
    return this.children$;
  }

  getById(id: string): Observable<Child | undefined> {
    return this.children$.pipe(map((children) => children.find((c) => c.id === id)));
  }

  getCount(): Observable<number> {
    return this.children$.pipe(map((children) => children.length));
  }

  add(child: Child): Observable<Child> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'children', child.id);
      return new Observable<Child>((observer) => {
        setDoc(ref, child.toFirestore())
          .then(() => {
            const current = this.childrenSubject.value;
            this.childrenSubject.next([...current, child]);
            observer.next(child);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const current = this.childrenSubject.value;
    this.childrenSubject.next([...current, child]);
    return of(child);
  }

  update(child: Child): Observable<Child> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'children', child.id);
      return new Observable<Child>((observer) => {
        setDoc(ref, child.toFirestore())
          .then(() => {
            const updated = this.childrenSubject.value.map((c) =>
              c.id === child.id ? child : c
            );
            this.childrenSubject.next(updated);
            observer.next(child);
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const updated = this.childrenSubject.value.map((c) => (c.id === child.id ? child : c));
    this.childrenSubject.next(updated);
    return of(child);
  }

  remove(id: string): Observable<void> {
    if (environment.useFirebase && this.firestore) {
      const ref = doc(this.firestore, 'children', id);
      return new Observable<void>((observer) => {
        deleteDoc(ref)
          .then(() => {
            const filtered = this.childrenSubject.value.filter((c) => c.id !== id);
            this.childrenSubject.next(filtered);
            observer.next();
            observer.complete();
          })
          .catch((err) => observer.error(err));
      });
    }

    const filtered = this.childrenSubject.value.filter((c) => c.id !== id);
    this.childrenSubject.next(filtered);
    return of(undefined).pipe(tap(() => void 0));
  }

  generateId(): string {
    return `child-${Date.now()}`;
  }
}
