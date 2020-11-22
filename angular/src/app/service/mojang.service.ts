import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UserData} from "./object/userData";

@Injectable({
  providedIn: 'root'
})
export class MojangService {

  private _authpath = 'https://authserver.mojang.com';

  constructor(private http: HttpClient) {
  }

  static get user(): UserData {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  static set user(value: UserData) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  public static resolveError(err: { cause: string | null; error: string | null; errorMessage: string | null; code: string | null; message: string | null; }) {
    // Mojang Response => err.cause | err.error | err.errorMessage
    // Node error => err.code | err.message
    if (err.cause != null && err.cause === 'UserMigratedException') {
      return {
        title: 'Erreur lors de la connexion : Références non valides',
        desc: 'Vous avez tenté de vous connecter avec un compte migré. Essayez à nouveau en utilisant l\'adresse électronique du compte comme nom d\'utilisateur.'
      };
    } else {
      if (err.error != null) {
        if (err.error === 'ForbiddenOperationException') {
          if (err.errorMessage != null) {
            if (err.errorMessage === 'Invalid credentials. Invalid username or password.') {
              return {
                title: 'Erreur lors de la connexion : Références non valides',
                desc: 'L\'adresse électronique ou le mot de passe que vous avez saisi est incorrect. Veuillez réessayer.'
              };
            } else if (err.errorMessage === 'Invalid credentials.') {
              return {
                title: 'Erreur lors de la connexion : Trop de tentatives',
                desc: 'Il y a eu trop de tentatives de connexion avec ce compte récemment. Veuillez réessayer plus tard.'
              };
            }
          }
        }
      } else {
        // Request errors (from Node).
        if (err.code != null) {
          if (err.code === 'ENOENT') {
            // No Internet.
            return {
              title: 'Erreur lors de la connexion : Pas de connexion Internet',
              desc: 'Vous devez être connecté à Internet pour pouvoir vous connecter. Veuillez vous connecter et réessayer.'
            };
          } else if (err.code === 'ENOTFOUND') {
            // Could not reach server.
            return {
              title: 'Erreur lors de la connexion : Serveur d\'authentification hors ligne',
              desc: 'Le serveur d\'authentification de Mojang est actuellement hors ligne ou inaccessible. Veuillez patienter un peu et réessayer. Vous pouvez vérifier l\'état du serveur sur le portail d\'aide de Mojang.'
            };
          }
        }
      }
    }
    if (err.message != null) {
      if (err.message === 'NotPaidAccount') {
        return {
          title: 'Erreur lors de la connexion : Jeu non acheté',
          desc: 'Le compte avec lequel vous essayez de vous connecter n\'a pas acheté une copie de Minecraft.<br>Vous pouvez acheter une copie sur Minecraft.net'
        };
      } else {
        // Unknown error with request.
        return {
          title: 'Erreur lors de la connexion : Erreur inconnue',
          desc: err.message
        };
      }
    } else {
      // Unknown Mojang error.
      return {
        title: err.error,
        desc: err.errorMessage
      };
    }
  }

  async authenticate(username: any, password: any, clientToken: any = null) {
    return new Promise<HttpResponse<UserData>>((resolve, reject) => {
      let body = {
        agent: {
          name: "Minecraft",
          version: 1
        },
        username: username,
        password: password,
        requestUser: true,
        clientToken: null
      };

      if (clientToken != null) {
        body.clientToken = clientToken;
      }

      let header = new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8');

      let request = this.http.post<any>(this._authpath + '/authenticate', JSON.stringify(body), {
        headers: header,
        observe: 'response'
      }).pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let resolveError1 = MojangService.resolveError(error.error);
          reject(resolveError1);
          return throwError(resolveError1.title);
        })
      );

      request.subscribe(resp => {
        if (resp.status === 200) {
          resolve(resp);
        } else {
          reject(resp);
        }
      });
    });
  }

  async validate(accessToken: any, clientToken: any = null) {
    return new Promise<boolean>((resolve, reject) => {
      let body = {
        accessToken: accessToken,
        clientToken: clientToken
      };

      let header = new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8');

      let request = this.http.post<any>(this._authpath + '/validate', JSON.stringify(body), {
        headers: header,
        observe: 'response'
      }).pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let resolveError1 = MojangService.resolveError(error.error);
          reject(false);
          return throwError(resolveError1.title);
        })
      );

      request.subscribe(resp => {
        if (resp.status === 204) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }
}
