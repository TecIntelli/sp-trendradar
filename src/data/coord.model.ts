/**
 * Repräsentiert eine Koordinate
 */
export class Coord {
  arg: number;
  val: number;

  /**
   * @param arg Koordinate der Argument Achse
   * @param val Koordinnate der Value Achse
   */
  constructor(arg: number, val: number) {
    this.arg = arg;
    this.val = val;
  }
}
