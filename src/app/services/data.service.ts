import {ITrenddata} from '../../data/trenddata.interface';
import {Trend} from '../../data/trend.model';
import {Injectable} from '@angular/core';
import {XLevel} from '../../data/xlevel.model';
import {ApiService} from './api.service';
import {Trendrating} from '../../data/trendrating.model';
import {TrendPositioningService} from './trend-positioning.service';
import {Metadata} from '../../data/metadata.model';
import {Level} from '../../data/level.model';
import {Rating} from '../../data/rating.model';

/**
 * Der DataService verwaltet die Daten innerhalb der gesamten Applikation.
 * Die im JSON-Format abgerufenen Daten werden in interne Objekte konvertiert.
 * Sämtliche Berechnungen werden von diesem Service ausgeführt
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  visibleSectors: number;           // Anzahl der aktuell im Chart angezeigten Sektoren
  visibleSectorsAsString: string;   // Sichbare Sektoren als String Beispiel Sektor 2 und 3 sichtbar dann => 23
  tickIntervalArgAxis: number;      // Sektorgöße im Radarchart
  meta: Metadata;                   // Metadaten
  result: ITrenddata;               // Ergebnis des API-Abrufes
  trends: Array<Trend> = [];        // Array mit Trendobjekten, in diesem Feld sind alle von der API-abgerufenen Trend vorhanden
  trendsToChart: Array<Trend> = []; // In diesem Array sind alle Trends vorhanden welche aktuell im Chart angezeigt werden sollen
  sectors: Array<XLevel> = [];      // vorhandene Sektoren
  visSectors: Array<XLevel> = [];   // Array mit sichtbaren Sektoren.
  effects: Array<XLevel> = [];      // vorhandene Effekte
  dataToSend: any;                  // Variable für Daten welche gesendet werden sollen

  /**
   * Sektorfarben Wichtig: Format RGBA. Anteile RGB immer dresistellig Besipiel: (007,180,061,1) nicht (7,180,62,1)
   */
  sectorColors: Array<string> = ['rgba(219,182,061,1)', 'rgba(071,177,219,1)', 'rgba(009,188,072,1)',
    'rgba(193,066,066,1)', 'rgba(063,127,191,1)'];
  /**
   * Effekfarben. Achtung diese Farben müssen zu den im RadarChart verwendeten Punkten passen
   * und in entsprechender Reihenfolge im Array sortiert sein
   */
  effectColors: Array<string> = ['#831DB3', '#FF5612', '#3934FF', '#B36D2D'];


  /**
   * Breistellung von API-Service und Positioning-Service
   * Bei Erzeugung der Komponenete werden über den ApiService die Daten geladen.
   * Anschließend werden interne Objekte zur weiteren Verwendung in der Applikation erzeugt.
   */
  constructor(private apiService: ApiService, private posServ: TrendPositioningService) {
    apiService.loadDataFromAPI().subscribe((data: ITrenddata) => {
      this.result = data;
      this.createInternalModel(this.result);
      this.calculateVisibleSectors();
      posServ.calculateCoordinates(this.trendsToChart, this.visSectors);
    });
  }

  /**
   *  Diese Mehtode konvertiert eine Bewertung vom Typ Trendrating ins JSON-Format
   *  und versendet das enstehende Objekt über den apiService.
   *  @param trendrating Zu sendendes Trendrating
   */
  sendTrendRating(trendrating: Trendrating) {
    this.dataToSend = JSON.stringify(trendrating);
    this.apiService.sendDataToAPI(this.dataToSend);
  }

  /**
   * Filtert aus den Metadaten die Sektoren und Effekte heraus, diese werden jeweils in eigenen Arrays innerhalb des DataService gespeichert
   * Jedem Sektor und Effekt wird eine Farbe zugewiesen.
   * @param meta Metadaten
   */
  createSectorsAndEffekts(meta: Metadata) {
    let color;
    meta.ratings.forEach(d => {
      if (d.name === 'sector') {
        d.levels.forEach(l => {
          color = this.sectorColors[l.value - 1];
          const s = new XLevel(l.name, l.value, true, color);
          this.sectors.push(s);
        });
      } else {
        if (d.name === 'effect') {
          d.levels.forEach(l => {
            color = this.effectColors[l.value - 1];
            const e = new XLevel(l.name, l.value, true, color);
            this.effects.push(e);
          });
        }
      }
    });
  }

  /**
   * Erstellen eines internen Models für die im JSON-Format empfangenen Daten
   * @param result über den API-Service empfangene Daten
   */
  createInternalModel(result: ITrenddata) {
    this.createMetadata(result);
    this.createSectorsAndEffekts(this.meta);
    this.createTrenddata(result);

  }

  /**
   * Diese Methode generiert ein Objekt, indem die empfangenen Metadaten verwaltet werden.
   * @param result über den API-Service empfangene Daten
   */
  createMetadata(result: ITrenddata) {
    this.meta = new Metadata();
    this.meta.projectname = result.meta.project.name;
    this.meta.modiefied = result.meta.project.modified;
    result.meta.ratings.forEach(x => {
      const aL: Array<Level> = [];
      x.levels.forEach(l => {
        const lev = new Level(l.name, l.value);
        aL.push(lev);
      });
      const r = new Rating(x.name, aL);
      this.meta.ratings.push(r);
    });
  }

  /**
   * Dieser Methode generiert für alle, in den empfangenen Trenddaten enthaltenen Elemente,
   * Trendobjekte für die weitere interne Verarbeitung. Diese Objekte werden dem Array trends hinzugefügt
   * Auch das Array trendsToCHart wird mit diesen Daten aktualisiert.
   * Trends mit fehlerhaften Sektor- oder Distanzangaben sowie solche mit fehlerhaften Effektangaben werden
   * werden herausgefiltert!
   * @param result über den API-Service empfangene Daten
   */
  createTrenddata(result: ITrenddata) {
    result.elements.forEach(d => {
      const t = new Trend(d.name, d.description, d.rating.sector, d.rating.distance, d.rating.effect,
        this.getSectorNameByValue(d.rating.sector), this.getDistNameByValue(d.rating.distance),
        this.getEffectAsString(d.rating.effect), 0, 0);
      t.effect.sort();
      if (t.sector < 1 || t.sector > this.sectors.length) {
        console.log('Trend aussortiert, Fehlerhafte Sektorangabe: ' + t.name);
      } else if (t.distance < 1 || t.distance > 3) {
        console.log('Trend aussortiert, Fehlerhafte Distanzangabe: ' + t.name);
      } else {
        if (this.checkeffects(t.effect) === false) {
          console.log('Trend aussortiert, Fehlerhafte Effekangaben: ' + t.name);
        } else {
          t.effect = this.correctEffects(t.effect);
          this.trends.push(t);
          console.log('trend added');
        }
      }
    });
    this.trendsToChart = this.trends;
  }

  /**
   * Ermittelt anhand der Sektornummer den dazugehörigen Sektornamen
   * @param secnum Nummer/ID des Sektors
   * @return Name des Sektors
   */
  getSectorNameByValue(secnum: number): string {
    let name = ' Kein Kategoriename vorhanden';
    this.meta.ratings.forEach(d => {
      if (d.name === 'sector') {
        d.levels.forEach(l => {
          if (l.value === secnum) {
            name = l.name;
          }
        });
      }
    });
    return name;
  }

  /**
   * Ermittelt anhand der Distanznummer den dazugehörigen Distanznamen
   * @param distnum Nummer/ID der Distanz
   * @return Name der Distanz
   */
  getDistNameByValue(distnum: number): string {
    let name = ' keine Distanzinformationen vorhanden';
    this.meta.ratings.forEach(d => {
      if (d.name === 'distance') {
        d.levels.forEach(l => {
          if (l.value === distnum) {
            name = l.name;
          }
        });
      }
    });
    return name;
  }

  /**
   * Ermittelt anhand der Effekte di dazugehörigen Effektnamen und gibt dieses als zusammengesetzten String zurück
   * @param effect Nummern/IDs des Effekte
   * @return Name der im Array als Nummern enthaltenen Effekte
   */
  getEffectAsString(effect: number[]): string {
    let name = '';
    this.meta.ratings.forEach(d => {
      if (d.name === 'effect') {
        d.levels.forEach(l => {
          effect.forEach(eff => {
            if (l.value === eff) {
              name = name + ' ' + l.name + ',';
            }
          });
        });
      }
    });
    return name;
  }

  /**
   * Prüft die Effektdaten auf korrekte Angaben, falls diese Fehlerhaft sind wird false zurückgegeben.
   * Dies ist der Fall wenn der Wert eines Effektes kleiner 1 oder größer 4 ist.
   * @param effect Effekte
   * @return false wenn fehlerhaft, sonst true
   */
  checkeffects(effect: number[]): boolean {
    let temp = true;
    let i = 0;
    if (effect.length === 0) {
      temp = false;
    } else {
      effect.forEach(val => {
        if (val < 1 || val > 4) {
          temp = false;
          i++;
        } else {
          if (i > 0) {
            temp = false
            ;
          } else {
            temp = true;
          }
        }
      });
    }
    return temp;
  }

  /**
   *  Korrigiert mehrfache vorhanden Effekte im Array
   *  @param effect Effekte
   *  @return Effekte ohne doppelte Elemente
   */
  correctEffects(effect: number[]): number[] {
    let j = 0;
    const eff = [];
    // console.log(effect);
    effect.forEach(e => {
      j = 0;
      // console.log(sec);
      eff.forEach(n => {
        // console.log(n + ' ' + t.sector);

        if (n === e) {
          j = 1;
        }
      });
      if (j === 0) {
        eff.push(e);
        // console.log('pushed');
      }
    });

    eff.sort();
    // console.log(eff);
    return eff;
  }


  /**
   * Berechnet die aktuell sichtbaren Sektoren. Die Anzahl wird in visibleSectors gespeichert.
   * Die Sektoren als zusammengezter String in visibleSectorsAsString und als Array in visSectors
   */
  calculateVisibleSectors() {
    const sec = [];
    this.visSectors = [];
    let i = 0;
    let color: string;
    this.trendsToChart.forEach(t => {
      i = 0;
      sec.forEach(n => {
        if (n === t.sector) {
          i = 1;
        }
      });
      if (i === 0) {
        sec.push(t.sector);
        this.sectors.forEach(sector => {
          if (sector.value === t.sector) {
            color = sector.color;
          }

        });
        this.visSectors.push(new XLevel(t.sectorname, t.sector, true, color));
      }
    });
    sec.sort();
    this.visibleSectors = sec.length;
    this.visibleSectorsAsString = sec.toString();
    this.calculateTickIntervallArgAxis();
  }

  /**
   * Je nach Anzahl der sichbaren Sektoren wird das entsprechende Tickintervall der Arg-Achse (Größe der Sektoren) ermittelt.
   * Dieser wird in tickIntervalArgAxis gespeichtert
   */
  calculateTickIntervallArgAxis() {
    this.tickIntervalArgAxis = 360 / this.visibleSectors;
  }

  /**
   * Diese Methode berechnet je nach eingestellten Filtern die aktuell anzuzeigenden Trends.
   * Zuerst wird geprüft ob der Sektor des Trends aktuell sichbar ist. Falls ja wird Trend in temporäres Array eingefügt.
   * Im zweiten Durchlauf wird geprüft ob min 1 Effekt sichtbar ist, falls ja wird Trend in ein weiteres temporäres Array übernommen.
   * In diesem Array sind dann alle den Filteeinstellungen entsprechenden Trends vorhanden.
   * Mit diesen Trends wird das Array trendsToChart aktualisiert und anschließend werden neue Koordinaten berechnet
   */

  filterActivated() {
    let i: number;
    const tempTrends: Array<Trend> = [];
    // Trend nach Sektoren Filtern
    this.trends.forEach(trend => {
      this.sectors.forEach(sec => {
        if (sec.value === trend.sector && sec.isVisible === true) {
          const t = new Trend(trend.name, trend.description, trend.sector, trend.distance, trend.effect,
            trend.sectorname, trend.distname, trend.effectsAsString, trend.arg, trend.val);
          tempTrends.push(t);
        }
      });
    });
    // Anschließend Filter nach Effekte
    const tempTrends2: Array<Trend> = [];
    tempTrends.forEach(trend => {
      i = 0;
      this.effects.forEach(eff => {
        if (eff.isVisible === true) {
          trend.effect.forEach(teff => {
            if (eff.value === teff && i === 0) {
              const t = new Trend(trend.name, trend.description, trend.sector, trend.distance, trend.effect,
                trend.sectorname, trend.distname, trend.effectsAsString, trend.arg, trend.val);
              tempTrends2.push(t);
              i = 1;
              // i = 1 verhindert das ein Trend doppelt hinzugefügt wird, wenn mehrere Effekte
            }
          });
        }
      });
    });

    this.trendsToChart = tempTrends2;
    this.calculateVisibleSectors();
    this.posServ.calculateCoordinates(this.trendsToChart, this.visSectors);

    console.log(this.trendsToChart); // TODO log entfernen
  }
}
