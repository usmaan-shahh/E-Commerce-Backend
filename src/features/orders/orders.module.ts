import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './infrastructure/order-entity';
import { OrderRepository } from './infrastructure/order-repository';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity])],
    providers: [
        {
            provide: 'IOrderRepository',
            useClass: OrderRepository,
        },
    ],
    exports: ['IOrderRepository'],
})
export class OrdersModule { }
