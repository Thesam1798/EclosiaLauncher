import {Injectable} from '@angular/core';
import {IpcRenderer} from "electron";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public static dev: boolean;

  private ipc: IpcRenderer

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch (error) {
        console.error('Could not load electron ipc !!!')
        throw error
      }
    } else {
      console.error('Could not load electron ipc')
    }
  }

  async closeApp() {
    return new Promise<boolean>((resolve) => {
      this.ipc.once("closeEventReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("closeEvent");
    });
  }

  async maxApp() {
    return new Promise<boolean>((resolve) => {
      this.ipc.once("maxEventReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("maxEvent");
    });
  }

  async minApp() {
    return new Promise<boolean>((resolve) => {
      this.ipc.once("minEventReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("minEvent");
    });
  }

  async isDev() {
    return new Promise<boolean>((resolve) => {
      this.ipc.once("isDebugReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("isDebug");
    });
  }

  async getData() {
    return new Promise<string>((resolve) => {
      this.ipc.once("getDataReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("getData");
    });
  }

  async openUrl(url: string) {
    return new Promise<string>((resolve) => {
      this.ipc.once("openLinkReturn", (event, arg) => {
        resolve(arg);
      });
      this.ipc.send("openLink", url);
    });
  }
}
