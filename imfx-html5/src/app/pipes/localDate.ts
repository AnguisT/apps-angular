import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'localDate'})
export class LocalDate implements PipeTransform {
    transform(value, args: string[]): any {
        let date = new Date(value).toLocaleString();
        return date;
    }
}