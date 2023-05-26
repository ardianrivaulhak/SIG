import { Component, OnInit, ViewEncapsulation } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { fuseAnimations } from '@fuse/animations'; 
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UserComponent implements OnInit {

  constructor(
    private _fuseConfigService: FuseConfigService,
    public _route: Router
  ) {
    this._fuseConfigService.config = {
      layout: {
          navbar   : {
              hidden: true
          },
          toolbar  : {
              hidden: true
          },
          footer   : {
              hidden: true
          },
          sidepanel: {
              hidden: true
          }
      }
  };
   }

  ngOnInit(): void {
  }

}
