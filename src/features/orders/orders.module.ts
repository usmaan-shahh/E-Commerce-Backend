import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './infrastructure/order-entity';
import { OrderRepository } from './infrastructure/order-repository';
import { PlaceOrderUseCase } from './application/use-cases/place-order';
import { PayOrderUseCase } from './application/use-cases/pay-order';
import { CancelOrderUseCase } from './application/use-cases/cancel-order';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity])],
    providers: [
        {
            provide: 'IOrderRepository',
            useClass: OrderRepository,
        },
        PlaceOrderUseCase,
        PayOrderUseCase,
        CancelOrderUseCase,
    ],
    exports: ['IOrderRepository', PlaceOrderUseCase, PayOrderUseCase, CancelOrderUseCase],
})
export class OrdersModule { }
