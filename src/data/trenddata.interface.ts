/**
 * Interface dient der Verabeitung der zu empfangenden JSON Daten und repräsentiert derren Aufbau.
 */

export interface ITrenddata {
  meta: {
    project: IProjectdata;
    ratings: IRating[];
  };
  elements: IElement [];
}

/**
 * Teil des Interfaces ITrenddata, Projectdata der zu empfangenden JSON Daten
 */
export interface IProjectdata {
  name: string;
  modified: string;
}

/**
 * Teil des Interfaces ITrenddata, Ratings in den Metadaten der zu empfangenden JSON Daten
 */
export interface IRating {
  name: string;
  levels: ILevel[];
}

/**
 * Teil des Interfaces ITrenddata, Levels der Ratings in den Metadaten der zu empfangenden JSON Daten
 */
export interface ILevel {
  value: number;
  name: string;
}

/**
 * Teil des interfaces ITrenddata, Rating der Elemente der zu empfangenden JSON Daten
 */
export interface ITrendrating {
  sector: number;
  distance: number;
  effect: number [];
}

/**
 * Teil des interfaces ITrenddata, Elemente der zu empfangenden JSON Daten
 */
export interface IElement {
  name: string;
  description: string;
  rating: ITrendrating;
}
