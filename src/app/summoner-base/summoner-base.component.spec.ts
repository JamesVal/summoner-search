import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerBaseComponent } from './summoner-base.component';

describe('SummonerBaseComponent', () => {
  let component: SummonerBaseComponent;
  let fixture: ComponentFixture<SummonerBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonerBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
