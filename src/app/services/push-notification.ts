import { Injectable, EventEmitter } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {

  // ✅ EventEmitter per comunicare con i component
  public notificationReceived = new EventEmitter<PushNotificationSchema>();

  constructor() { }

  async initPushNotifications(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      console.log('🌐 Push notifications disponibili solo su mobile');
      return null;
    }

    console.log('📱 Inizializzazione Push Notifications...');

    try {
      const permStatus = await PushNotifications.requestPermissions();
      
      if (permStatus.receive !== 'granted') {
        console.error('❌ Permessi push notifications negati');
        return null;
      }

      console.log('✅ Permessi granted!');
      await PushNotifications.register();

      // Token ricevuto
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('🔑 FCM Token ricevuto:', token.value);
        this.saveFcmToken(token.value);
      });

      // Errori
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('❌ Errore registrazione push:', error);
      });

      // ✅ Notifica ricevuta in foreground - USA L'EVENT EMITTER!
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('📬 Notifica ricevuta (foreground):', notification);
          // Emetti l'evento invece di usare alert()
          this.notificationReceived.emit(notification);
        }
      );

      // Notifica cliccata
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (action: ActionPerformed) => {
          console.log('👆 Notifica cliccata:', action);
          const data = action.notification.data;
          console.log('📦 Dati notifica:', data);
        }
      );

      return 'initialized';

    } catch (error) {
      console.error('❌ Errore init push notifications:', error);
      return null;
    }
  }

  private saveFcmToken(token: string) {
    console.log('💾 Salvando FCM token:', token);
    localStorage.setItem('fcm_token', token);
  }

  getFcmToken(): string | null {
    return localStorage.getItem('fcm_token');
  }

  async removeAllListeners() {
    await PushNotifications.removeAllListeners();
  }
}