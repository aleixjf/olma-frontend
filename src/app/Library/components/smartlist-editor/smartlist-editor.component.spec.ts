import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartlistEditorComponent } from './smartlist-editor.component';

describe('SmartlistEditorComponent', () => {
  let component: SmartlistEditorComponent;
  let fixture: ComponentFixture<SmartlistEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartlistEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartlistEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
