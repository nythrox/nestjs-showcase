import { HttpException, HttpStatus } from "@nestjs/common";

export class MaxLenghException extends HttpException {
    constructor(maxLength : number) {
      super("Max length of "+maxLength+" exceeded.", HttpStatus.BAD_REQUEST);
    }
  }
  