import {Injectable} from '@angular/core';
import {IpcRenderer} from "electron";
import {LoggerService} from "./logger.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public static dev: boolean;
  private readonly ipc: IpcRenderer | undefined;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        LoggerService.error('Could not load electron ipc !!!', "App Service");
        throw error;
      }
    } else {
      LoggerService.error('Could not load electron ipc', "App Service");
    }
  }

  async closeApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('CloseApp : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("closeEventReturn");

      this.ipc.once("closeEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("closeEvent");
    });
  }

  async maxApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('MaxApp : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("maxEventReturn");

      this.ipc.once("maxEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("maxEvent");
    });
  }

  async minApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('MinApp : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("minEventReturn");

      this.ipc.once("minEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("minEvent");
    });
  }

  async getLastVersion() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetLastVersion : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("getLastVersionReturn");

      this.ipc.once("getLastVersionReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this.ipc.send("getLastVersion");
    });
  }

  async openUrl(url: string) {
    return new Promise<string>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('OpenUrl : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("openLinkReturn");

      this.ipc.once("openLinkReturn", (event: any, arg: string | PromiseLike<string> | undefined) => {
        resolve(arg);
      });
      this.ipc.send("openLink", url);
    });
  }

  async getBuildDate() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetBuildDate : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("getBuildDateReturn");

      this.ipc.once("getBuildDateReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this.ipc.send("getBuildDate");
    });
  }

  async getAppName() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetAppName : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("getAppNameReturn");

      this.ipc.once("getAppNameReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this.ipc.send("getAppName");
    });
  }

  async toggleDevTools() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this.ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('ToggleDevTools : Timeout');
        return;
      }, 5000);

      this.ipc.removeAllListeners("toggleDevToolsReturn");

      this.ipc.once("toggleDevToolsReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "boolean") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this.ipc.send("toggleDevTools");
    });
  }
}
