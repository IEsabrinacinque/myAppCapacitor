import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-native-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './native-features.html',
  styleUrl: './native-features.css',
})
export class NativeFeatures {
  isNative = Capacitor.isNativePlatform();
  imagePreview?: string;
  imageInfo?: { name: string; type: string; size: number };
  previewKey = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef  // 🔑 AGGIUNGI QUESTO
  ) {}

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    this.ngZone.run(() => {
      this.setImage(image.webPath!, 'camera_photo.jpg', 'image/jpeg', 0);
      this.cdr.detectChanges();  // 🔥 FORZA IL CHANGE DETECTION
    });
  }

  async pickFromGallery() {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    this.ngZone.run(() => {
      this.setImage(image.webPath!, 'gallery_image.jpg', 'image/jpeg', 0);
      this.cdr.detectChanges();  // 🔥 FORZA IL CHANGE DETECTION
    });
  }

  onFileSelected(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;

    input.value = '';
    this.imagePreview = URL.createObjectURL(file);
    this.imageInfo = {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1024),
    };
    this.previewKey++;

    console.log('🖼 IMMAGINE SETTATA:', this.imageInfo);
  }

  private setImage(preview: string, name: string, type: string, size: number) {
    this.imagePreview = preview;
    this.imageInfo = { name, type, size };
    this.previewKey++;
  }
}