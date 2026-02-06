import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Order } from "../../domain/aggregate/root";

@Injectable()
export class PayOrderUseCase {

  constructor() { }

  async execute(orderId: string) {

    const row = await this.orderRepo.findById(orderId);
    if (!row) throw new NotFoundException('Order not found');

    // Rehydrate from aggregate root
    const order = Order.fromPrimitives(row);

    try {
      order.markPaid();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.orderRepo.save(order.toPrimitives());

    return { status: 'PAID' };
  }
}
