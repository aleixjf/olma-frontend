import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelAddButtonComponent } from './add-playlist.component';

describe('SidePanelAddButtonComponent', () => {
  let component: SidePanelAddButtonComponent;
  let fixture: ComponentFixture<SidePanelAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelAddButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
