/**
 * Komponenete für die Anzeige der Filtereinstellungen
 */

import {Component, Input} from '@angular/core';
import {DataService} from '../services/data.service';
import {XLevel} from '../../data/xlevel.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  /**
   * Zugriff auf DataService wir bereitgestellt.
   *
   */
  constructor(public dataService: DataService) {
  }

  /**
   * Methode wird aufgerufen wenn sich der Zustand einer Checkbox (aktiviert/nicht aktiviert) ändert.
   * Die Variable isVisible des jeweiligen Sektors/Effekts wird aktualisiert und die Methode filterActivated im DataService aufgerufen.
   * Dadurch wird eine Neuberechnung der anzuzeigenden Trends ausgelöst.
   * @param {any} e Event welches Methode ausgelöst hat
   * @param {XLevel} sec Sektor/Effekt dessen Checkbox geändert wurde
   */
  checkBoxChanged(e: any, sec: XLevel) {
    sec.isVisible = e.value;
    this.dataService.filterActivated();
  }
}
