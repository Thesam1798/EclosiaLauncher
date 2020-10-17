import {Injectable} from '@angular/core';
import {IpcRenderer} from "electron";
import version from "./object/version";
import data from "./object/data";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public static dev: boolean;

  private readonly ipc: IpcRenderer | undefined;

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
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }

      this.ipc.once("closeEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("closeEvent");
    });
  }

  async maxApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("maxEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("maxEvent");
    });
  }

  async minApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("minEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("minEvent");
    });
  }

  async isDev() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("isDebugReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("isDebug");
    });
  }

  async getLastVersion() {
    return new Promise<version>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("getLastVersionReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(JSON.parse(arg))
        } else {
          reject(arg)
        }
      });
      this.ipc.send("getLastVersion", {prerelease: true});
    });
  }

  async getData() {
    return new Promise<data>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("getDataReturn", (event: any, arg: data | PromiseLike<data> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("getData");
    });
  }

  async openUrl(url: string) {
    return new Promise<string>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject(false);
        return;
      }
      this.ipc.once("openLinkReturn", (event: any, arg: string | PromiseLike<string> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("openLink", url);
    });
  }
}
