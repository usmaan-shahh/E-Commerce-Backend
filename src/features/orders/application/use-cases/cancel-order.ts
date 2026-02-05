
@Injectable()
export class CancelOrderUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(orderId: string) {
    const row = await this.orderRepo.findById(orderId);
    if (!row) throw new NotFoundException("Order not found");

    const order = Order.fromPrimitives(row);

    try {
      order.cancel(); // domain rule
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepo.save(order.toPrimitives());

    return { status: "CANCELLED" };
  }
}
