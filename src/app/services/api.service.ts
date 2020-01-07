import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {ITrenddata} from '../../data/trenddata.interface';

// Dieser Service stellt den Api-Zugriff für die Anwendung bereit
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //apiUrl = 'https://service.tecintelli.de/sp/trend-management/api/v2/trends/';  // Url des Api-Endpunktes
  apiKey = 'Api-Key vNI2YM8b.eFw3PRmhpKP0spW4o88xrHJAdzHQGhyQ';                 // Api Key zur Authentifizierung
  apiUrl = './assets/trends.json';                                            // Url für lokale Testdaten

  constructor(private http: HttpClient) {
  }

  /** Diese Methode ruft die Trenddaten über Http/s vom Server ab.
   * Ist der Abruf nicht erfolgreich, wird dieser 3 mal wiederholt.
   * Gelingt es dann immer noch nicht die Daten abzurufen wird die Methode dataError zur Fehlerbehandlung aufgerufen.
   * @returns observable
   */
  loadDataFromAPI() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.apiKey
      })
    };
    console.log(httpOptions); // TODO
    return this.http.get<ITrenddata>(this.apiUrl, httpOptions).pipe(retry(3), catchError(this.dataError));
  }

  /**
   * Diese Methode dient dazu Daten zum API-Endpunkt zu senden. Da dieses aktuell nicht unterstützt wird ist der Teil auskommentiert.
   * Stattdessen erfolgt eine Ausgabe auf der Konsole.
   * @param obj Zu sendendes Object
   */
  sendDataToAPI(obj: any) {
    /*  const httpOptions = {
        headers: new HttpHeaders({
          Authorization: this.apiKey
        })
      };
      this.http.post(this.apiUrl, obj, httpOptions);*/
    console.log(obj);
  }

  /**
   * Diese Methode wird im Fehlerfall aufgerufen, falls der Datenabruf vom Server fehlschlägt.
   * Es wird eine Fehlermeldung, welche den Fehlerort Server/Client sowie die Fehlernachricht enthält angezeigt
   * @param error Aufgetretende Fehlermeldung
   */
  dataError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      window.alert('Fehler beim Abruf der Trenddaten vom Server !!!' +
        '\nBitte versuchen Sie es zu einem späteren Zeitpunkt erneut' +
        '\nDieser Fehler ist auf dem Client aufgetreten' +
        '\nFehlernachricht:\n' +
        ' ' + error.message);
    } else {
      window.alert('Fehler beim Abruf der Trenddaten vom Server !!!' +
        '\nBitte versuchen Sie es zu einem späteren Zeitpunkt erneut' +
        '\nDieser Fehler ist auf dem Server aufgetreten' +
        '\nFehlernachricht: ' +
        '\n' + error.message);
      console.log(error);
    }
    return throwError(
      'Fehler beim Abruf der Trenddaten vom Server !!!');
  }
}
