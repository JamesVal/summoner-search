import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  summonerName: string = "";

  summonerNameInvalid () : boolean {
    return (this.summonerName.length == 0);
  }
  
  constructor() { }

  ngOnInit() {
  }

}
