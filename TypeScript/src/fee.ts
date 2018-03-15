export enum AgeType {
  Infant = 'I',
  Child = 'C',
  Adult = 'A'
}
export enum DiscountType {
  None = 'n',
  Pass = 'p',
  Welfare = 'w'
}

export class Fee
{
  private assumedFee:number;
  private free = false;

  public constructor(
    private baseFee:number,
    private ageType:AgeType,
    private discountType:DiscountType
  ) {
    this.calcAssumedFee();
  };

  private calcAssumedFee() {
    if (this.discountType === DiscountType.Pass) {
      this.assumedFee = 0;
      return;
    }

    switch (this.ageType) {
      case AgeType.Adult:
        this.assumedFee = this.baseFee;
        if (this.discountType === DiscountType.Welfare) {
          this.assumedFee = this.calcHalf(this.assumedFee);
        }
        break;
      case AgeType.Child:
      case AgeType.Infant:
        this.assumedFee = this.calcHalf(this.baseFee);
        if (this.discountType === DiscountType.Welfare) {
          this.assumedFee = this.calcHalf(this.assumedFee);
        }
        break;
    }
  }

  private calcHalf(value:number):number {
    return Math.ceil((value / 2) / 10) * 10;
  }

  public getAssumedFee():number {
    return this.assumedFee;
  }

  public getAgeType(): AgeType {
    return this.ageType;
  }
  public getDiscountType(): DiscountType {
    return this.discountType;
  }

  public setFree() {
    this.free = true;
  }

  public getFee():number {
    if (this.free) {
      return 0;
    }

    return this.assumedFee;
  }
}

export class Calculator
{
  public calc(data:Fee[]):number {
    const adultsCount = data.filter((fee:Fee) => {
      return fee.getAgeType() === AgeType.Adult;
    }).length;

    const paidInfants = data.filter((fee:Fee) => {
      return fee.getAgeType() === AgeType.Infant && fee.getAssumedFee() > 0;
    }).sort((a:Fee, b:Fee) => {
      return b.getAssumedFee() - a.getAssumedFee();
    }).slice(0, adultsCount * 2);

    paidInfants.forEach((infantFee:Fee) => {
      infantFee.setFree();
    });

    return data.reduce((current:number, fee:Fee) => {
      return current + fee.getFee();
    }, 0);
  }
}
