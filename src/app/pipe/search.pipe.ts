import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    if (!items) return [];
    if (!terms) return items;
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.city.toLowerCase().includes(terms) + 
        it.name.toLowerCase().includes(terms) +
        it.state.toLowerCase().includes(terms);
    });
  }
}
