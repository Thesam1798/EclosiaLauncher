import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UserData} from "./obejct/userData";

@Injectable({
  providedIn: 'root'
})
export class MojangService {

  private _authpath = 'https://authserver.mojang.com'

  constructor(private http: HttpClient) {
  }

  static get user(): UserData {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  static set user(value: UserData) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  private static resolveError(err: { cause: string | null; error: string | null; errorMessage: string | null; code: string | null; message: string | null; }) {
    // Mojang Response => err.cause | err.error | err.errorMessage
    // Node error => err.code | err.message
    if (err.cause != null && err.cause === 'UserMigratedException') {
      return {
        title: 'Error During Login: Invalid Credentials',
        desc: 'You\'ve attempted to login with a migrated account. Try again using the account email as the username.'
      }
    } else {
      if (err.error != null) {
        if (err.error === 'ForbiddenOperationException') {
          if (err.errorMessage != null) {
            if (err.errorMessage === 'Invalid credentials. Invalid username or password.') {
              return {
                title: 'Error During Login: Invalid Credentials',
                desc: 'The email or password you\'ve entered is incorrect. Please try again.'
              }
            } else if (err.errorMessage === 'Invalid credentials.') {
              return {
                title: 'Error During Login: Too Many Attempts',
                desc: 'There have been too many login attempts with this account recently. Please try again later.'
              }
            }
          }
        }
      } else {
        // Request errors (from Node).
        if (err.code != null) {
          if (err.code === 'ENOENT') {
            // No Internet.
            return {
              title: 'Error During Login: No Internet Connection',
              desc: 'You must be connected to the internet in order to login. Please connect and try again.'
            }
          } else if (err.code === 'ENOTFOUND') {
            // Could not reach server.
            return {
              title: 'Error During Login: Authentication Server Offline',
              desc: 'Mojang\'s authentication server is currently offline or unreachable. Please wait a bit and try again. You can check the status of the server on <a href=\"https://help.mojang.com/\">Mojang\'s help portal</a>.'
            }
          }
        }
      }
    }
    if (err.message != null) {
      if (err.message === 'NotPaidAccount') {
        return {
          title: 'Error During Login: Game Not Purchased',
          desc: 'The account you are trying to login with has not purchased a copy of Minecraft.<br>You may purchase a copy on <a href=\"https://minecraft.net/\">Minecraft.net</a>'
        }
      } else {
        // Unknown error with request.
        return {
          title: 'Error During Login: Unknown Error',
          desc: err.message
        }
      }
    } else {
      // Unknown Mojang error.
      return {
        title: err.error,
        desc: err.errorMessage
      }
    }
  }

  async authenticate(username: any, password: any, clientToken: null) {
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
        body.clientToken = clientToken
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
          reject(resolveError1)
          return throwError(resolveError1.title);
        })
      )

      request.subscribe(resp => {
        if (resp.status === 200) {
          resolve(resp)
        } else {
          reject(resp)
        }
      });
    });
  }
}
