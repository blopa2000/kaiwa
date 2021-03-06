import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chainAdjustment',
})
export class ChainAdjustmentPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    const words: string = String(value);
    const argument: number = Number(args[0]);

    if (words.length > argument) {
      const letters: string = words.slice(0, argument);
      return letters + '...';
    }
    return value;
  }
}
