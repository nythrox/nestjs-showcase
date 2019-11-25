import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import { MaxLenghException } from '../exceptions/max-length.exception';

@Injectable()
export class MaxLengthValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length < metadata.data)
    return value;
    else
    throw new MaxLenghException(parseInt(metadata.data));
  }
}


