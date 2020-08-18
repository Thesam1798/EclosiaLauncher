import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../_alert/service/alert.service";
import {MojangService} from "../../service/mojang.service";

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit {

  constructor(private alert: AlertService) {
  }

  ngOnInit(): void {
    this.alert.success(
      "Vous est login !",
      "Redémarrer le launcher pour retourner sur la page de connection<br> Auto login : " + MojangService.user?.user?.autologin,
      true,
      false
    )
  }

}
