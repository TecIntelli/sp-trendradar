import {Level} from './level.model';


/**
 * Objekt repräsentier eine Trendbewertung
 */
export class Trendrating {
  trendname: string;
  ratings: Array<Level> = [{name: 'Eintrittswahrscheinlichkeit', value: 0},
    {name: 'Auswirkungsstärke', value: 0},
    {name: 'Marktpotenzial', value: 0},
    {name: 'Relevanz', value: 0},
    {name: 'Nachhaltigkeit', value: 0}];
}
