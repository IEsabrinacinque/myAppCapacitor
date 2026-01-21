// src/app/utils/security-helper.ts
import * as CryptoJS from 'crypto-js';

export class SecurityHelper {

  static createMD5(input: string): string {
    return CryptoJS.MD5(input)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase(); // 🔥 IMPORTANTISSIMO (come MAUI)
  }

}
