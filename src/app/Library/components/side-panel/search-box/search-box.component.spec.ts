import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelSearchBoxComponent } from './search-box.component';

describe('SidePanelSearchBoxComponent', () => {
  let component: SidePanelSearchBoxComponent;
  let fixture: ComponentFixture<SidePanelSearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelSearchBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
