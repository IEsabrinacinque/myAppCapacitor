import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeFeatures } from './native-features';

describe('NativeFeatures', () => {
  let component: NativeFeatures;
  let fixture: ComponentFixture<NativeFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NativeFeatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
