import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from "./shared/footer/footer";
import { Toast } from './shared/toast/toast'; // ← AGGIUNGI
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotificationService } from './services/push-notification';
import { ToastService } from './services/toast'; // ← AGGIUNGI

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast], // ← AGGIUNGI Toast
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  protected readonly title = signal('myAppCapacitor');

  constructor(
    private pushService: PushNotificationService,
    private toastService: ToastService // ← AGGIUNGI
  ) {
    // ✅ Ascolta le notifiche ricevute in foreground
    this.pushService.notificationReceived.subscribe((notification) => {
      console.log('📬 Mostrando toast per notifica:', notification);
      this.toastService.show(
        `${notification.title}: ${notification.body}`,
        'success'
      );
    });
  }

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });

      await this.pushService.initPushNotifications();
      console.log('✅ Push Notifications inizializzate!');
    }
  }
}