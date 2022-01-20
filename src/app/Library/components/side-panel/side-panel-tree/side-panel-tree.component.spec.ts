import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelTreeComponent } from './side-panel-tree.component';

describe('SidePanelTreeComponent', () => {
  let component: SidePanelTreeComponent;
  let fixture: ComponentFixture<SidePanelTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidePanelTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
