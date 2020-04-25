import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsSearchComponent } from './configurations-search.component';

describe('ConfigurationsSearchComponent', () => {
  let component: ConfigurationsSearchComponent;
  let fixture: ComponentFixture<ConfigurationsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
