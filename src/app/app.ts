import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from "./shared/footer/footer";

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  protected readonly title = signal('myAppCapacitor');

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {

      // 🔥 QUESTO È IL FIX PRINCIPALE
      await StatusBar.setOverlaysWebView({ overlay: false });

      // estetica (opzionale ma consigliata)
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    }
  }
}
