export class Alert {
  id: string | undefined;
  type: AlertType | undefined;
  title: string | undefined;
  message: string | undefined;
  autoClose: boolean | undefined;
  keepAfterRouteChange: boolean | undefined;
  fade: boolean | undefined;
  fadeAction: boolean | undefined;
  noClose: boolean | undefined;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}
