import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summoner-base',
  templateUrl: './summoner-base.component.html',
  styleUrls: ['./summoner-base.component.css']
})
export class SummonerBaseComponent implements OnInit {

  isActiveURL(pathToCheck: string): boolean {
    return (pathToCheck == this.route.firstChild.snapshot.url[0].path);
  }

/*
  updateNavbar(): void {
    console.log(this.route.firstChild.snapshot.url[0].path);
  }
*/
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
/*    
    this.updateNavbar();
    
    // Check if the route has updated
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateNavbar();
      }
    });
*/
  }

}
