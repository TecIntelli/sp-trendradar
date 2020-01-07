import {Trend} from './trend.model';
import {Coord} from './coord.model';

/**
 * In diesem Objekt können Trends für einen Sektor nach Ringen sortiert verwaltet werden.
 * Zusätzlich besteht die Möglichkeit Koordinaten für den jeweiligen Sektor zu verwalten.
 * Objekt wird vom positioning-Service zur Sortierung der Trends verwendet
 */
export class SectorRC {
  value: number;
  rings: Array<Array<Trend>>;
  coords: Array<Array<Coord>>;

  /**
   * @param number Sektornummber/ID
   */
  constructor(num: number) {
    this.value = num;
    this.rings = [];
    this.coords = [];
  }
}
