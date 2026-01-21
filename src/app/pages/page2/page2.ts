import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core'; // ← Questo rimane
import { SecurityHelper } from '../../utils/security-helper';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-page2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page2.html',
  styleUrl: './page2.css',
})
export class Page2 {
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  showPassword = false;
  isLoading = false;

  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  showToast = false;

  model = {
    nome: '',
    cognome: '',
    sesso: '',
    dataNascita: '',
    comune: '',
    provincia: '',
    codiceFiscale: '',
    indirizzoResidenza: '',
    civicoResidenza: '',
    comuneResidenza: '',
    provinciaResidenza: '',
    telefono: '',
    email: '',
    password: '',
    tagCliente: 'DemoBroker',
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private mostraToast(messaggio: string, tipo: 'success' | 'error' | 'warning') {
    this.toastMessage = messaggio;
    this.toastType = tipo;
    this.showToast = true;
    this.cdr.markForCheck();

    setTimeout(() => {
      this.showToast = false;
      this.cdr.markForCheck();
    }, 5000);
  }

  async openDatePicker(dateInput: HTMLInputElement) {
    if (Capacitor.isNativePlatform()) {
      const { value } = await (window as any).DatePicker.show({
        date: new Date(),
        mode: 'date',
      });
      this.model.dataNascita = value.split('T')[0];
    } else {
      dateInput.click();
    }
  }

  private validaFormulario(): boolean {
    const campiObbligatori = [
      { nome: 'nome', label: 'Nome' },
      { nome: 'cognome', label: 'Cognome' },
      { nome: 'sesso', label: 'Sesso' },
      { nome: 'dataNascita', label: 'Data di Nascita' },
      { nome: 'comune', label: 'Comune' },
      { nome: 'provincia', label: 'Provincia' },
      { nome: 'codiceFiscale', label: 'Codice Fiscale' },
      { nome: 'indirizzoResidenza', label: 'Indirizzo di residenza' },
      { nome: 'civicoResidenza', label: 'Civico' },
      { nome: 'comuneResidenza', label: 'Comune di residenza' },
      { nome: 'provinciaResidenza', label: 'Provincia di residenza' },
      { nome: 'telefono', label: 'Telefono' },
      { nome: 'email', label: 'Email' },
      { nome: 'password', label: 'Password' },
    ];

    for (const campo of campiObbligatori) {
      if (!this.model[campo.nome as keyof typeof this.model]) {
        this.mostraToast(`⚠️ Completa il campo: ${campo.label}`, 'warning');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.model.email)) {
      this.mostraToast('⚠️ Email non valida', 'warning');
      return false;
    }

    if (this.model.password.length < 6) {
      this.mostraToast('⚠️ La password deve avere almeno 6 caratteri', 'warning');
      return false;
    }

    return true;
  }

  private resetForm() {
    this.model = {
      nome: '',
      cognome: '',
      sesso: '',
      dataNascita: '',
      comune: '',
      provincia: '',
      codiceFiscale: '',
      indirizzoResidenza: '',
      civicoResidenza: '',
      comuneResidenza: '',
      provinciaResidenza: '',
      telefono: '',
      email: '',
      password: '',
      tagCliente: 'DemoBroker',
    };
    this.showPassword = false;
  }

  // 🔥 FUNZIONE CON CAPACITOR HTTP request()
  async registraCliente() {
    if (!this.validaFormulario()) {
      return;
    }

    this.isLoading = true;

    try {
      const sub_ag = 1;
      const cod_cli = 0;

      let md5 = '';
      try {
        const raw = `${this.model.nome}${this.model.cognome}${sub_ag}UckvUzhezt`;
        md5 = SecurityHelper.createMD5(raw);
      } catch (e) {
        console.error('❌ ERRORE MD5:', e);
        this.mostraToast('❌ Errore interno (MD5)', 'error');
        this.isLoading = false;
        return;
      }

      const payload = {
        cod_cli,
        Nome: this.model.nome,
        Cognome: this.model.cognome,
        Sesso: this.model.sesso,
        DataNascita: this.model.dataNascita,
        Comune: this.model.comune,
        Provincia: this.model.provincia,
        CodiceFiscale: this.model.codiceFiscale,
        IndirizzoResidenza: this.model.indirizzoResidenza,
        CivicoResidenza: this.model.civicoResidenza,
        ComuneResidenza: this.model.comuneResidenza,
        ProvinciaResidenza: this.model.provinciaResidenza,
        Telefono: this.model.telefono,
        Email: this.model.email,
        psw: this.model.password,
        TagCliente: 'DemoBroker',
        SUB_AG: sub_ag,
        MD5: md5,
      };

      const apiUrl = 'https://broker.newpicass.it/api/mobile/RegistratiMobile';

      // 🔥 SE SEI SU MOBILE, USA CAPACITOR HTTP request() (NO CORS!)
      if (Capacitor.isNativePlatform()) {
        console.log('📱 MOBILE - Usando CapacitorHttp.request() (NO CORS)');
        
        try {
          const response: HttpResponse = await CapacitorHttp.request({  // ← USA request()
            url: apiUrl,
            method: 'POST',  // ← Specifica il metodo
            headers: { 'Content-Type': 'application/json' },
            data: payload,
          });

          console.log('✅ RISPOSTA API:', response.data);

          if (response.data?.codErrore === 0) {
            this.mostraToast('✅ Registrazione completata!', 'success');
            this.resetForm();
          } else {
            this.mostraToast(response.data?.messaggio || 'Errore sconosciuto', 'error');
          }
        } catch (err: any) {
          console.error('❌ ERRORE API:', err);
          this.mostraToast('❌ Errore durante la registrazione', 'error');
        } finally {
          this.isLoading = false;
        }
      } 
      // 🌐 SE SEI SUL WEB, USA HTTPCLIENT CON PROXY
      else {
        console.log('🌐 WEB - Usando HttpClient con proxy');
        
        this.http
          .post('/api/mobile/RegistratiMobile', payload)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
          .subscribe({
            next: (res: any) => {
              console.log('✅ RISPOSTA API:', res);

              if (res?.codErrore === 0) {
                this.mostraToast('✅ Registrazione completata!', 'success');
                this.resetForm();
              } else {
                this.mostraToast(res?.messaggio || 'Errore sconosciuto', 'error');
              }
            },
            error: (err) => {
              console.error('❌ ERRORE API:', err);
              this.mostraToast('❌ Errore durante la registrazione', 'error');
            },
          });
      }
    } catch (err) {
      console.error('❌ ERRORE BLOCCANTE:', err);
      this.isLoading = false;
      this.mostraToast('❌ Errore imprevisto', 'error');
    }
  }
}