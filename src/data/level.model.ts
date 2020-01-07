/**
 *  Die Klasse Level repräsentiert ein Objekt für die interne Verabeitung der empfangenen Effekt- und Sektordaten
 */

export class Level {
  name: string;
  value: number;

  /**
   * @param name Name
   * @param value Nummer/ID
   */
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}
