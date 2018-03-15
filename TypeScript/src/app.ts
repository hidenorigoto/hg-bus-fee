import {Fee, Calculator} from './fee';

export class App
{
  private baseFee:number;
  private codes:Fee[];

  public solve(input:string): number {
    this.parseInput(input);
    const calculator = new Calculator();
    return calculator.calc(this.codes)
  }

  private parseInput(input:string) {
    let input2:string;
    let baseFee:string;
    [baseFee, input2] = input.split(':');
    this.baseFee = parseInt(baseFee);
    this.codes = input2.split(',').map((code:string) => {
      let ageType, discountType;
      [ageType, discountType] = code.split('');
      return new Fee(this.baseFee, ageType, discountType);
    });
  }
}
