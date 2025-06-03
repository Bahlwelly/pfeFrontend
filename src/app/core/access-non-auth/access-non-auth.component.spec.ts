import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessNonAuthComponent } from './access-non-auth.component';

describe('AccessNonAuthComponent', () => {
  let component: AccessNonAuthComponent;
  let fixture: ComponentFixture<AccessNonAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessNonAuthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessNonAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
