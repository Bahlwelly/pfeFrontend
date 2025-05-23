import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortener',
  standalone: true
})
export class ShortenerPipe implements PipeTransform {

  transform (text : string, limit : number = 20, byPhrase : boolean = false) : string {
    if (!text) return '';

    if (byPhrase) {
      const phrases = text.split(/[.?!]/).map(p => p.trim()).filter(Boolean);
      return phrases[0] + (phrases.length > 1 ? '...' : '');
    }


    const words = text.split(' ');
    if (words.length <= limit) return text;
    
    return words.slice(0, limit).join(' ') + '...';
  }

}
