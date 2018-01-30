import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  summonerName: string = "";

  PressedEnter(evt) : void {
    evt.target.blur();
    window.location.href = "./summonerdetails/"+this.summonerName;
  }
  
  updateSummonerData(): void {
    if (this.route.firstChild) {
      var summonerName = this.route.firstChild.snapshot.paramMap.get('name');

      if (summonerName) this.summonerName = summonerName;
    }
  }
  
  summonerNameInvalid(): boolean {
    return (this.summonerName.length == 0);
  }
  
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
  // Check if the route has updated
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.updateSummonerData();
    }
  });
    
  }

}
