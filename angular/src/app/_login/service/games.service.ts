import {EventEmitter, Injectable} from '@angular/core';
import GameData from "./objects/gamesData";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  public static gamesChange: EventEmitter<number> = new EventEmitter<number>(true)
  private static id = 0;

  constructor() {
  }

  static get games(): GameData[] {
    let data = localStorage.getItem('games');

    if (data === null) {
      this.games = [
        {
          name: 'Minecraft',
          slg: 'Connection via Mojang',
          image: './assets/images/icons/minecraft.png',
          active: false,
          dir: 'minecraft'
        },
        {
          name: 'Arma 3',
          slg: 'Connection via Forum',
          image: './assets/images/icons/arma3.png',
          active: false,
          dir: 'arma3'
        }
      ];

      return this.games
    } else {
      return JSON.parse(data);
    }
  }

  static set games(value: GameData[]) {
    localStorage.setItem('games', JSON.stringify(value));
    GamesService.gamesChange.emit(GamesService.id);
  }

  static gameSelected(): GameData[] {
    return GamesService.games.filter(data => {
      return data.active === true
    });
  }
}
