import {Rating} from './rating.model';

/**
 * Klasse für die interne Verarbeitung der Metadaten
 */
export class Metadata {
  projectname: string;
  modiefied: string;
  ratings: Array<Rating>;

  constructor() {
    this.ratings = [];
  }
}

