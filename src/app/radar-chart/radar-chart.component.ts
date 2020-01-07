import {Component, Input, OnChanges} from '@angular/core';
import {Trend} from '../../data/trend.model';
import {DataService} from '../services/data.service';

/**
 *  Komponente erzeugt RadarChart
 */
@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})

export class RadarChartComponent implements OnChanges {

  @Input() trends: Array<Trend> = [];       // zu visualisierende Trends
  @ Input() visibleSectors: number;         // aktuell sichtbare Sektoren
  @ Input() tickIntervalArgAxis: number;    // Tickintervall (Sektorgröße)
  popupVisible = false;                     // Sichtbarkeit des PopUps Trendinformation
  popup2Visible = false;                    // Sichtbarkeit des PopUps Bewertung
  currentTrend: string;                     // Trendname zudem aktuell Infos angezeigt werden
  currentSector: string;                    // Sektorname zum aktuellen Trend
  currentDistname: string;                  // Distanzname des aktuellen Trends
  currentEffect: string;                    // Effekte des aktuellen Trends als String
  currentDescription: string;               // Text der Trendbeschreibung im PopUp
  ArgStrips = [];                           // Array für Konfiguration der Hintergrundfarbe Sektoren
  ValStrips = [];                           // Array für Konfiguration der Hintergrundfarbe Ringe
  sizeOneEffect = 35;                       // Größe der Datenpunkte mit einem Effekt
  sizeTwoEffects = 40;                      // Größe der Datenpunkte mit zwei Effekten
  sizeThreeEffects = 45;                    // Größe der Datenpunkte mit drei Effekten
  sizeFourEffects = 50;                     // Größe der Datenpunkte mit vier Effekten



  /**
   *  Bereitstellung von DataService
   */
  constructor(public dataService: DataService) {
  }

  /**
   * Wird bei jeder Änderung ausgeführt, und ruft die Mehtode setStrips auf
   */
  ngOnChanges() {
    this.setStrips();
  }


  /**
   *  Berechnung der farblichen Hinterlegung des Radarcharts abhängig von der Anzahl der sichbaren Sektoren.
   *  Ist nur ein Sektor sichtbar werden die Ringe in unterschiedlicher Tranzparenz der Sektorfarbe hinterlegt.
   *  Ansonsten die jeweiligen Sektoren in entsprechender Farbe.
   *  Konfiguration wird in den Arrays ValStrips und ArgStrips gespeichert. Die jeweils nicht aktive muss auf undefined gesetzt werden.
   */
  setStrips() {
    switch (this.visibleSectors) {
      case 1 :
        const color1 = this.dataService.visSectors[0].color;
        const temp = color1.slice(0, 17);
        const color2 = temp.concat('0.75)');
        const color3 = temp.concat('0.5)');
        this.ValStrips = [{startValue: 0, endValue: 100, color: color3},
          {startValue: 100, endValue: 200, color: color2},
          {startValue: 200, endValue: 300, color: color1}];
        this.ArgStrips = undefined;
        break;
      default:
        this.ArgStrips = [];
        let i = 0;
        let j = 1;
        this.dataService.visSectors.forEach(sector => {
          this.ArgStrips.push({startValue: (this.tickIntervalArgAxis * i), endValue: (this.tickIntervalArgAxis * j), color: sector.color});
          i = i + 1;
          j = j + 1;
        });
        this.ValStrips = undefined;
    }
  }

  /**
   * Erzeugt den Inhalt des Tooltips welches beim Hovern der Datenpunkte angezeigt wird.
   * @param arg aktueller Datenpunkt
   * @return Trendname des übergebenen Punktes
   */
  customizeTooltip(arg: any): any {
    return {
      text: arg.point.data.name
    };
  }

  /**
   * Abhängig von den jeweiligen Effekte eines Trends wird der entsprechende Datenpunkt zurückgegeben.
   * @param arg aktueller Datenpunkt
   * @return SVG des enstprechenden Datenpunktes
   */
  customizePoint = (arg: any) => {
    const temp = arg.data.effect.toString();
    switch (temp) {
      case '1'    :
        return {image: {url: './assets/Points/Point1.svg', width: this.sizeOneEffect, height: this.sizeOneEffect}, visible: true};
      case '2'    :
        return {image: {url: './assets/Points/Point2.svg', width: this.sizeOneEffect, height: this.sizeOneEffect}, visible: true};
      case '3'    :
        return {image: {url: './assets/Points/Point3.svg', width: this.sizeOneEffect, height: this.sizeOneEffect}, visible: true};
      case '4'    :
        return {image: {url: './assets/Points/Point4.svg', width: this.sizeOneEffect, height: this.sizeOneEffect}, visible: true};
      case '1,2'   :
        return {image: {url: './assets/Points/Point12.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '1,3'   :
        return {image: {url: './assets/Points/Point13.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '1,4'   :
        return {image: {url: './assets/Points/Point14.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '2,3'   :
        return {image: {url: './assets/Points/Point23.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '2,4'   :
        return {image: {url: './assets/Points/Point24.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '3,4'   :
        return {image: {url: './assets/Points/Point34.svg', width: this.sizeTwoEffects, height: this.sizeTwoEffects}, visible: true};
      case '1,2,3'  :
        return {image: {url: './assets/Points/Point123.svg', width: this.sizeThreeEffects, height: this.sizeThreeEffects}, visible: true};
      case '1,2,4'  :
        return {image: {url: './assets/Points/Point124.svg', width: this.sizeThreeEffects, height: this.sizeThreeEffects}, visible: true};
      case '1,3,4'  :
        return {image: {url: './assets/Points/Point134.svg', width: this.sizeThreeEffects, height: this.sizeThreeEffects}, visible: true};
      case '2,3,4'  :
        return {image: {url: './assets/Points/Point234.svg', width: this.sizeThreeEffects, height: this.sizeThreeEffects}, visible: true};
      case '1,2,3,4' :
        return {image: {url: './assets/Points/Point1234.svg', width: this.sizeFourEffects, height: this.sizeFourEffects}, visible: true};
      default:
        return {color: 'black', visible: true};
    }
  };

  /**
   * Wird beim Anklicken eines Datenpunktes aufgerufen, ermittelt die Informationen zum aktuellen Trend
   * und macht dann das PopUp sichtbar, sodass diese Infos angezeigt werden.
   * @param e ausgelöstes Event
   */
  pointClick(e: any) {
    const point = e.target;
    this.currentTrend = point.data.name;
    this.currentSector = point.data.sectorname;
    this.currentDistname = point.data.distname;
    this.currentEffect = point.data.effectsAsString;
    this.currentDescription = point.data.description;
    this.popupVisible = true;
  }


  /**
   *  Methode sorgt dafür, dass das PopUp für die Trendbewertung angezeigt wird.
   */
  openRatingPopUp() {
    this.popup2Visible = true;
  }

  /**
   *  Methode sorgt dafür, dass das PopUp für die Trendbewertung geschlossen wird.
   */
  closeRatingPopUp() {
    this.popup2Visible = false;
  }

}
