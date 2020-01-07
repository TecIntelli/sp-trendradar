import {Component} from '@angular/core';
import {DataService} from './services/data.service';

/**
 * Hauptkomponente der Anwendung, stellt die Navigationsstruktur bereit
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BA';

  /**
   * Erzeugt Komponente und stellt Zugriff auf DataService bereit.
   */
  constructor(dataService: DataService) {
  }
}
