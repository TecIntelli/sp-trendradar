import {Component} from '@angular/core';
import {DataService} from '../services/data.service';
/**
 *  Containerkomponente zur Aufnahme von RadarChart und Filterkomponente.
 */
@Component({
  selector: 'app-chartcontainer',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})


export class ChartContainerComponent {

  /**
   * Erzeugt Komponente und stellt Zugriff auf DataService bereit.
   */
  constructor(public dataService: DataService) {
  }

}
