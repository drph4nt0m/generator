import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPrettierComponent } from './json-prettier.component';

describe('JsonPrettierComponent', () => {
  let component: JsonPrettierComponent;
  let fixture: ComponentFixture<JsonPrettierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonPrettierComponent]
    });
    fixture = TestBed.createComponent(JsonPrettierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
