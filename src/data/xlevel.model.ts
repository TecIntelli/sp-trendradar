import {Level} from './level.model';
/**
 * Erweitert die Klasse Level um die Variablen isVisible, und color
 */
export class XLevel implements Level {
  name: string;
  value: number;
  isVisible: boolean;
  color: string;

  /**
   * @param name Name des Levels
   * @param value Nummer/ID im Datensatz
   * @param value isVisible aktulle Sichtbarkeit
   * @param color Farbe des Levels
   */
  constructor(name: string, value: number, isVisible: boolean, color: string) {
    this.name = name;
    this.value = value;
    this.isVisible = isVisible;
    this.color = color;
  }
}
