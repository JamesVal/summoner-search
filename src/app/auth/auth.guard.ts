import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SummonerService } from '../summoner.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.summonerService.summonerName.length > 0 ) {
      return true;
    } else {
      this.router.navigate(['.']);
      return false;
    }

  }

  constructor(private router: Router, private summonerService: SummonerService) {}
}
