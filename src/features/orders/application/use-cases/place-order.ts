import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Order } from "../../domain/aggregate-root";
import { Money } from "../../domain/value-objects/money-vo";
import { Quantity } from "../../domain/value-objects/quatity-vo";

@Injectable()
export class PlaceOrderUseCase {
  constructor() {}

  async execute(input: { productId: string; qty: number }) {

    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new NotFoundException('Product not found');

    // Wrap raw values into VOs (boundary)
    const quantity = Quantity.validate(input.qty);
    const price = Money.validate(product.price); // assume price is in paise/cents

    if (product.stock < quantity.getValue()) {
      throw new BadRequestException('Out of stock');
    }

    // Domain creation (Aggregate Root)
    const order = Order.create(input.productId, quantity, price);

    // Side effects
    product.stock -= quantity.getValue();

    await this.productRepo.save(product);
    await this.orderRepo.save(order.toPrimitives());

    return { orderId: order.toPrimitives().id };
  }
}
