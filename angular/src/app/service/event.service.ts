import {Injectable} from '@angular/core';
import {IpcRenderer} from "electron";
import {LoggerService} from "./logger.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public static dev: boolean;
  private readonly _ipc: IpcRenderer | undefined;

  constructor() {
    if ((<any>window).require) {
      try {
        this._ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        LoggerService.error('Could not load electron ipc !!!', "App Service");
        throw error;
      }
    } else {
      LoggerService.error('Could not load electron ipc', "App Service");
    }
  }

  get ipc(): Electron.IpcRenderer | undefined {
    return this._ipc;
  }

  async closeApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('CloseApp : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("closeEventReturn");

      this._ipc.once("closeEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this._ipc.send("closeEvent");
    });
  }

  async maxApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('MaxApp : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("maxEventReturn");

      this._ipc.once("maxEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this._ipc.send("maxEvent");
    });
  }

  async minApp() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('MinApp : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("minEventReturn");

      this._ipc.once("minEventReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        resolve(arg);
      });
      this._ipc.send("minEvent");
    });
  }

  async getLastVersion() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetLastVersion : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("getLastVersionReturn");

      this._ipc.once("getLastVersionReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("getLastVersion");
    });
  }

  async openUrl(url: string) {
    return new Promise<string>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('OpenUrl : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("openLinkReturn");

      this._ipc.once("openLinkReturn", (event: any, arg: string | PromiseLike<string> | undefined) => {
        resolve(arg);
      });
      this._ipc.send("openLink", url);
    });
  }

  async getBuildDate() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetBuildDate : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("getBuildDateReturn");

      this._ipc.once("getBuildDateReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("getBuildDate");
    });
  }

  async getAppName() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetAppName : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("getAppNameReturn");

      this._ipc.once("getAppNameReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("getAppName");
    });
  }

  async getAppDir() {
    return new Promise<string>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('GetAppDir : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("getAppDirReturn");

      this._ipc.once("getAppDirReturn", (event: any, arg: string | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "string") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("getAppDir");
    });
  }

  async toggleDevTools() {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('ToggleDevTools : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("toggleDevToolsReturn");

      this._ipc.once("toggleDevToolsReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "boolean") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("toggleDevTools");
    });
  }

  openDir(dir: string) {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof this._ipc === "undefined") {
        reject("IPC : undefined");
        return;
      }

      setTimeout(() => {
        reject('openDir : Timeout');
        return;
      }, 5000);

      this._ipc.removeAllListeners("openDirReturn");

      this._ipc.once("openDirReturn", (event: any, arg: boolean | PromiseLike<boolean> | undefined) => {
        if (typeof arg === "boolean") {
          resolve(arg);
        } else {
          reject(arg);
        }
      });
      this._ipc.send("openDir", dir);
    });
  }
}
