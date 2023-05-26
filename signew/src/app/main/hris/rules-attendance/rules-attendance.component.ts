import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RulesAttendanceService } from './rules-attendance.service';
import { fuseAnimations } from '@fuse/animations';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuService } from 'app/main/analystpro/services/menu/menu.service';
import * as global from 'app/main/global';

@Component({
  selector: 'app-rules-attendance',
  templateUrl: './rules-attendance.component.html',
  styleUrls: ['./rules-attendance.component.scss']
})
export class RulesAttendanceComponent implements OnInit {

  constructor(
    private _rulesServ: RulesAttendanceService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _menuServ: MenuService
  ) { }

  ngOnInit(): void {
  }

}
