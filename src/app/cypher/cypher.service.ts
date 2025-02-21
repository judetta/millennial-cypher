import { Injectable } from '@angular/core';
import { keys } from './cypher-key.constant';

@Injectable({
  providedIn: 'root'
})
export class CypherService {
  public encrypt(text: string): string {
    const letters = text.split('');
    const cyphers: string[] = [];
    for (const letter of letters) {
      const cypher = this.findKey(letter);
      cyphers.push(cypher);
    }
    return cyphers.join('');
  }

  public decrypt(_cypher: string): string {
    // TODO: implement
    throw new Error('Decryption not yet implemented.')
  }

  private findKey(letter: string): string {
    if (letter.length > 1) {
      throw new Error('Provide only single letter.');
    } else {
      const key = Object.entries(keys).find(([_keys, letters]) => letters.includes(letter))?.[0];
      if (!key) {
        return '';
      } else {
        const index = keys[key].indexOf(letter);
        return key.repeat(index + 1);
      }
    }
  }
}
