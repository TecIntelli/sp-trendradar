import {Trend} from '../../data/trend.model';
import {XLevel} from '../../data/xlevel.model';
import {Coord} from '../../data/coord.model';
import {SectorRC} from '../../data/sector-rc.model';
import {SectorRcContainer} from '../../data/sector-rc-container.model';
import {Injectable} from '@angular/core';

/**
 *  Dieser Service dient der Brechnung von Koordinaten zur Positionierung der Trends im RadarChart
 */
@Injectable({
  providedIn: 'root',
})
export class TrendPositioningService {
  tickaArgAxis: number;
  tickValAxis = 100;
  container: SectorRcContainer;

  /**
   * Diese Methode startet die Koordinatenberechnung.
   * Koordinaten werden später direkt in die beim Aufruf übergebenen Trends geschrieben.
   * @param trends Trends für die Koordinaten berechnet werden sollen
   * @param sectors Aktuell im Chart vorhandene Sektoren
   */
  calculateCoordinates(trends: Trend[], sectors: XLevel[]) {
    console.log(sectors);
    this.calcNumberOfTrendsInSector(trends, sectors);
    this.calcCoord();
    this.writeCoords();
  }

  /**
   * Sortiert die Trends nach Sektor und Ring. Das Ergebnis wird in container gespeichert.
   * @param trends Trends die sortiert werden sollen
   * @param sectors Aktuell im Chart vorhandene Sektoren
   */
  calcNumberOfTrendsInSector(trends: Trend[], sectors: XLevel[]) {
    this.container = new SectorRcContainer();
    this.tickaArgAxis = 360 / sectors.length;
    sectors.forEach(sec => {
      const secRing = new SectorRC(sec.value);
      const r1: Array<Trend> = [];
      const r2: Array<Trend> = [];
      const r3: Array<Trend> = [];
      trends.forEach(trend => {
        if (sec.value === trend.sector) {
          switch (trend.distance) {
            case 1:
              r1.push(trend);
              break;
            case 2:
              r2.push(trend);
              break;
            case 3:
              r3.push(trend);
              break;
            default:
              console.log('Fehler');
          }
        }
      });
      secRing.rings.push(r1);
      secRing.rings.push(r2);
      secRing.rings.push(r3);
      this.container.sectors.push(secRing);
    });
    console.log(this.container);
  }

  /**
   *  Berechnet die Koordinaten, abhängig von Trendanzahl, Sektoranzahl und Ring.
   *  Diese werden im Coord Array des jewiligen SectorRC Objektes gespeichert
   */
  calcCoord() {

    let endArgAxis: number;
    let startArgAxis: number;
    let endValAxis: number;
    let startValAxis: number;
    let distArg: number;
    let distVal: number;
    let aktRing: number;
    let aktSector = 1;
    let x: number;
    let val: number;
    let arg: number;
    let trendanzahl: number;
    let sectoranzahl: number;
    let maxAbschnitte: number;
    let rows: number;
    const marginArg = 2;
    const marginVal = 10;

    this.container.sectors.forEach(sector => {
      aktRing = 1;
      sector.rings.forEach(ring => {
        const coord: Array<Coord> = [];
        trendanzahl = ring.length;
        sectoranzahl = this.container.sectors.length;
        maxAbschnitte = 15 / sectoranzahl * aktRing;
        endArgAxis = this.tickaArgAxis * aktSector;
        startArgAxis = endArgAxis - this.tickaArgAxis;
        endValAxis = this.tickValAxis * aktRing;
        startValAxis = endValAxis - this.tickValAxis;
        rows = Math.ceil((trendanzahl / maxAbschnitte));
        distVal = this.tickValAxis / rows;
        if (trendanzahl < maxAbschnitte) {
          distArg = this.tickaArgAxis / trendanzahl;
        } else {
          distArg = this.tickaArgAxis / maxAbschnitte;
        }

        if (rows > 1) {

          distArg = this.tickaArgAxis / Math.ceil((trendanzahl / rows));
        }
        x = 0;
        for (let i = 1; i <= Math.ceil((trendanzahl / rows)); i++) {
          for (let j = 1; j <= rows; j++) {
            val = this.getRandomNumber(startValAxis + (distVal * (j - 1)) + marginVal, startValAxis + (distVal * j) - marginVal);
            arg = this.getRandomNumber(startArgAxis + (distArg * x) + marginArg, startArgAxis + (distArg * i) - marginArg);
            coord.push(new Coord(arg, val));

          }
          x = x + 1;
        }
        sector.coords.push(coord);
        aktRing = aktRing + 1;
      });
      aktSector = aktSector + 1;
    });

  }

  /**
   * Schreibt die zwischengespeicherten Koordinaten in die entsprechenden Variablen der Trends zurück
   */

  writeCoords() {
    this.container.sectors.forEach(sector => {
      let r = 0;
      sector.rings.forEach(trends => {
        const coord: Array<Coord> = sector.coords[r];
        let i = 0;
        trends.forEach(trend => {
          trend.arg = coord[i].arg;
          trend.val = coord[i].val;
          i = i + 1;
        });
        r = r + 1;
      });
    });
  }

  /**
   * Erzeugt eine Zufallszahl im Bereich zwischen zwei Zahlen
   * Wenn zahlen nicht gerade wird min auf- und max abgerundet
   * @param min Zahl 1
   * @param max Zahl 2
   * @return Zufallszahl zwischen Zahl 1 und Zahl 2
   */
  getRandomNumber(min, max) {
    min = Math.ceil(min); // aufrunden
    max = Math.floor(max); // abrunden
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

} // positioning


// console.log('TickArg: ' + this.tickaArgAxis + ' Startarg: ' + startArgAxis + ' DistArg: ' + distArg + ' Endarg: ' + endArgAxis +
//           ' StartVal ' + startValAxis +
//           ' EndVal: ' + endValAxis + ' Distval: ' + distVal);
//         console.log('Trendanzahl: ' + trendanzahl + ' Rows: ' + rows + ' Abschn: ' + maxAbschnitte + ' sectoren: ' + sectoranzahl);
// TODO entfernen
