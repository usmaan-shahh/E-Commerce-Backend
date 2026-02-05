export class Quantity {

  private constructor(private readonly value: number) { }

  static validate(value: number) {
    if (!Number.isInteger(value) || value <= 0) throw new Error("Invalid Quantity")
    return new Quantity(value);
  }

  static create(value: number) {
    return Quantity.validate(value);
  }

  getValue() {
    return this.value;
  }

}


// This Guarantees Every Quantity in your system is valid.