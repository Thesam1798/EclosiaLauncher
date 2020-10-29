import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Alert, AlertType} from '../model/alert.model';
import {AlertService} from "../service/alert.service";
import {IconsService} from "../../service/icons.service";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription | undefined;
  routeSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private alertService: AlertService,
    public icons: IconsService
  ) {
  }

  ngOnInit(): void {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        if (alert.fade === true) {
          alert.fadeAction = false;
        }

        // auto close alert if required
        if (alert.autoClose && alert.type !== AlertType.Error) {
          setTimeout(() => this.removeAlert(alert, false), 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe to avoid memory leaks
    if (typeof this.alertSubscription !== "undefined") {
      this.alertSubscription.unsubscribe();
    }

    if (typeof this.routeSubscription !== "undefined") {
      this.routeSubscription.unsubscribe();
    }
  }

  removeAlert(alert: Alert, click: Boolean): void {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (!click && this.fade && alert.autoClose && alert.type !== AlertType.Error) {
      // fade out alert
      let find = this.alerts.find(x => x === alert);
      if (find === null || typeof find === "undefined") return;
      find.fadeAction = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 2200);
    } else {
      // remove alert
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert): string | string[] {
    if (!alert || typeof alert.type === "undefined") return '';

    const classes = [];

    const alertTypeClass = {
      [AlertType.Success]: 'success',
      [AlertType.Error]: 'error',
      [AlertType.Info]: 'info',
      [AlertType.Warning]: 'warning'
    }

    if (alert.fadeAction === true && alert.autoClose) {
      classes.push('fade');
    }

    classes.push(alertTypeClass[alert.type]);

    return classes;
  }

  cssClassIcons(alert: Alert): IconDefinition {
    if (!alert || typeof alert.type === "undefined") return this.icons.warning;

    const classes = [];

    const alertTypeClass = {
      [AlertType.Error]: this.icons.bug,
      [AlertType.Warning]: this.icons.warning,
      [AlertType.Success]: this.icons.check,
      [AlertType.Info]: this.icons.info
    }

    classes.push(alertTypeClass[alert.type]);

    return classes[0];
  }

  revert() {
    return this.alerts.slice().reverse().slice(0, 4);
  };
}
