export default class version {
  version: string | undefined;
  assets: file[] | undefined;
  upgrade: boolean | undefined;
  system: string | undefined;
}

export class file {
  name: string | undefined;
  browser_download_url: string | undefined;
}
