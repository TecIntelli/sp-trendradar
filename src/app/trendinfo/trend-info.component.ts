import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Komponente für die Anzeige von Trendinformationen
 */
@Component({
  selector: 'app-trendinfo',
  templateUrl: './trend-info.component.html',
  styleUrls: ['./trend-info.component.css']
})
export class TrendInfoComponent {
  @Input() currentTrend: string;                                         // Trendname zudem aktuell Infos angezeigt werden
  @Input() currentSector: string;                                        // Sektorname zum aktuellen Trend
  @Input() currentDistname: string;                                      // Distanzname des aktuellen Trends
  @Input() currentEffect: string;                                        // Effekte des aktuellen Trends als String
  @Input() currentDescription: string;                                   // Beschreibung des aktuellen Trends
  @Output('ratingButtonClicked') change: EventEmitter<boolean>;          // um Übergeordnete Komponente bei klick des Buttons zu informieren

  /*
  * Erzeugt EventEmitter
  * */
  constructor() {
    this.change = new EventEmitter<boolean>();
  }

  /**
   * Wird bei Klick auf den Ratingbutton aufgerufen und löst einen Event des EventEmitters aus.
   * @param $event Beim Klick ausgelöstes Event
   */
  ratingButtonClicked($event: any) {
    this.change.emit(true);
  }

}
