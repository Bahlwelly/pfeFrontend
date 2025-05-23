import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNoirComponent } from './list-noir.component';

describe('ListNoirComponent', () => {
  let component: ListNoirComponent;
  let fixture: ComponentFixture<ListNoirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNoirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListNoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
