import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  peopleOutline,
  megaphoneOutline,
  medkit,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home-outline' },
    { title: 'Crianças', url: '/criancas', icon: 'people-outline' },
    { title: 'Campanhas', url: '/campanhas', icon: 'megaphone-outline' },
  ];

  constructor() {
    addIcons({ homeOutline, peopleOutline, megaphoneOutline, medkit });
  }
}
