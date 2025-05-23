import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainteDetailsComponent } from './plainte-details.component';

describe('PlainteDetailsComponent', () => {
  let component: PlainteDetailsComponent;
  let fixture: ComponentFixture<PlainteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlainteDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlainteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
