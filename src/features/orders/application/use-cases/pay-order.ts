import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { IOrderRepository } from "../../domain/interface/order-interface";
import { OrderEvents } from "../../domain/events/order.events";
import { OrderPaidEvent } from "../../domain/events/order-paid.event";

@Injectable()
export class PayOrderUseCase {

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(orderId: string) {

    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    try {
      order.markPaid();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.orderRepo.save(order);

    // Publish domain events
    for (const event of order.pullDomainEvents()) {
      if (event instanceof OrderPaidEvent) {
        this.eventEmitter.emit(OrderEvents.OrderPaid, event);
      }
    }

    return { status: 'PAID' };
  }
}
