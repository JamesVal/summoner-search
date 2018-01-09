import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerDetailsComponent } from './summoner-details.component';

describe('SummonerDetailsComponent', () => {
  let component: SummonerDetailsComponent;
  let fixture: ComponentFixture<SummonerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
