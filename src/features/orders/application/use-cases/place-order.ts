import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Order } from "../../domain/aggregate/root";
import { Money } from "../../domain/value-objects/money-vo";
import { Quantity } from "../../domain/value-objects/quatity-vo";
import type { IOrderRepository } from "../../domain/interface/order-interface"


@Injectable()
export class PlaceOrderUseCase {

  constructor(
    @Inject('IOrderRepository')
    private readonly OrderRepositoryInterface: IOrderRepository,
  ) {}

  async execute(input: { productId: string; qty: number }) {
    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new NotFoundException('Product not found');

    const quantity = Quantity.validate(input.qty);
    const price = Money.validate(product.price);

    if (product.stock < quantity.getValue()) {
      throw new BadRequestException('Out of stock');
    }

    const order = Order.create(input.productId, quantity, price);

    product.stock -= quantity.getValue();

    await this.productRepo.save(product);
    await this.OrderRepositoryInterface.save(order);

    return { orderId: order.toPrimitives().id };
  }
}
