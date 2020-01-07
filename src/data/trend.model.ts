/**
 * Diese Klasse repräsentiert einen Trend
 */
export class Trend {
  name: string;
  description: string;
  sector: number;
  distance: number;
  effect: Array<number>;
  // Position
  arg: number;
  val: number;
  sectorname: string;
  distname: string;
  effectsAsString: string;

  /**
   * @param name Name des Trends
   * @param description Beschreibung des Trend
   * @param sector Sektornummer
   * @param distance Distanz
   * @param effect Effekte des Trend
   * @param sectorname Name des Sektors
   * @param distname Name der Distanz
   * @param effectsAsString Alle Effekte als String
   * @param arg Koordinate der Argument Achse
   * @param val Koordinate der Value Achse
   */
  constructor(name: string, description: string, sector: number, distance: number, effect: Array<number>,
              sectorname: string, distname: string, effectsAsString: string, arg: number, val: number) {
    this.name = name;
    this.description = description;
    this.sector = sector;
    this.distance = distance;
    this.effect = effect;
    this.arg = arg;
    this.val = val;
    this.sectorname = sectorname;
    this.distname = distname;
    this.effectsAsString = effectsAsString;
  }
}
