import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
        if (value) {
            const date = value.split(',');
            date.forEach((res, index) => {
                if (!value.match(/^([0-9]{1,2})\-([0-9]{1,2})\-([0-9]{4})$/)) {
                    if (res.length > 0) {
                        const datePipe = new DatePipe('en-US');
                        date[index] = datePipe.transform(res, 'dd-MM-yyyy');
                    }
                }
            });
            value = date.join(',');
        }
        return value;
    }
}
