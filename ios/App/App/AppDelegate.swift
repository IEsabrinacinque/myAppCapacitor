import UIKit
import Capacitor
import FirebaseCore
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // 🔥 Configura Firebase
        FirebaseApp.configure()
        
        // 🔔 Configura notifiche
        UNUserNotificationCenter.current().delegate = self
        
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(options: authOptions) { granted, error in
            print("✅ iOS Permission granted: \(granted)")
        }
        
        // Registra per notifiche remote
        application.registerForRemoteNotifications()
        
        // Imposta Messaging delegate
        Messaging.messaging().delegate = self
        
        return true
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
    // 🔔 Resetta badge quando app diventa attiva
    UIApplication.shared.applicationIconBadgeNumber = 0
    UNUserNotificationCenter.current().removeAllDeliveredNotifications()
}
    
    func applicationWillTerminate(_ application: UIApplication) {
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // 📱 Riceve APNs token
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("📱 APNs Token ricevuto!")
        Messaging.messaging().apnsToken = deviceToken
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("❌ Errore registrazione APNs: \(error.localizedDescription)")
    }
}

// 🔔 Gestione notifiche quando app è aperta
extension AppDelegate: UNUserNotificationCenterDelegate {
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, 
                                willPresent notification: UNNotification, 
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([[.banner, .sound, .badge]])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                            didReceive response: UNNotificationResponse,
                            withCompletionHandler completionHandler: @escaping () -> Void) {
    // 🔔 Resetta badge quando utente tocca la notifica
    UIApplication.shared.applicationIconBadgeNumber = 0
    completionHandler()
}
}

// 🔥 Gestione FCM Token
extension AppDelegate: MessagingDelegate {
    
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("🔥 FCM Token: \(fcmToken ?? "nil")")
        
        // Invia al Capacitor
        if let token = fcmToken {
            NotificationCenter.default.post(name: Notification.Name("FCMToken"), object: nil, userInfo: ["token": token])
        }
    }
}