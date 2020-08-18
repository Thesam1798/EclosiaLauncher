import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Alert, AlertType} from '../model/alert.model';
import {AlertService} from "../service/alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private alertService: AlertService) {
  }

  ngOnInit() {
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
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade === true && alert.autoClose === true && alert.type !== AlertType.Error) {
      // fade out alert
      this.alerts.find(x => x === alert).fadeAction = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 2200);
    } else {
      // remove alert
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

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

  cssClassIcons(alert: Alert) {
    if (!alert) return;

    const classes = ['fas'];

    const alertTypeClass = {
      [AlertType.Success]: 'fa-times-circle',
      [AlertType.Error]: 'fa-bug',
      [AlertType.Info]: 'fa-info-circle',
      [AlertType.Warning]: 'fa-exclamation-triangle'
    }

    classes.push(alertTypeClass[alert.type]);

    return classes;
  }

  revert() {
    return this.alerts.slice().reverse().slice(0, 4);
  };
}
