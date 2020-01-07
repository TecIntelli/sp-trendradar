import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trendrating} from '../../data/trendrating.model';
import {DataService} from '../services/data.service';

/**
 *  Komponente für Trendbewertung
 */
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  ratingsToSend: Trendrating;                                // Objekt welches die Trendbewertung enthält
  @Input() currentTrend: string;                             // aktueller Trend für den Bewertung abgegeben wird
  @Output('ratingSend') change: EventEmitter<boolean>;       // Um Radarchartkomponente zu Informieren wenn PopUp geschlossen werden soll

  /**
   * Stellt DataService bereit. Erzuegt ein neues Objekt für die Trendbewertung sowie einen EventEmitter.
   */
  constructor(private dataService: DataService) {
    this.ratingsToSend = new Trendrating();
    this.change = new EventEmitter<boolean>();
  }

  /**
   * Wir beim Klick auf den Buttuon "Bewertung abgeben" aufgerufen, und  gibt die Bewertung zum versenden an den DataService.
   * Anschließend wird ein neues Objekt für die nächste Bewertung erzeugt.
   * @param $event beim Klick ausgelöstes Event
   */
  buttonclicked($event: any) {
    this.ratingsToSend.trendname = this.currentTrend;
    this.dataService.sendTrendRating(this.ratingsToSend);
    this.ratingsToSend = new Trendrating();
    this.change.emit(false);
  }
}
