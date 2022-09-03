export class SuccessDto {
  readonly message: string;

  constructor(message: string = "Success") {
    this.message = message;
  }
}