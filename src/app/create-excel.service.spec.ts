import { TestBed, inject } from '@angular/core/testing';

import { CreateExcelService } from './create-excel.service';

describe('CreateExcelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateExcelService]
    });
  });

  it('should be created', inject([CreateExcelService], (service: CreateExcelService) => {
    expect(service).toBeTruthy();
  }));
});
