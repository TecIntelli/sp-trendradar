import {Level} from './level.model';

/**
 * Objekt für die Interne Verarbeitung der empfangenen Ratingdaten
 */
export class Rating {
  name: string;
  levels: Array<Level>;

  /**
   * @param name Name
   * @param levels Array mit Levels
   */
  constructor(name: string, levels: Array<Level>) {
    this.name = name;
    this.levels = levels;
  }
}
