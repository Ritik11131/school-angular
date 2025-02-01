import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagSeverity',
  pure: true, // Pure by default, but explicitly set for clarity
  standalone: true
})
export class TagSeverityPipe implements PipeTransform {
  transform(item: any, field: any): any {
    if (field === 'role') {
      switch (item[field]) {
        case 'Pilot':
          return 'info';
        case 'Teacher':
          return 'warn';
        default:
          return 'contrast';
      }
    }
    return 'success';
  }
}