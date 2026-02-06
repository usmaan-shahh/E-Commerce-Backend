import { Entity, Column, PrimaryColumn } from 'typeorm';
import type { OrderStatus } from '../domain/aggregate/root';

@Entity('orders')
export class OrderEntity {

    @PrimaryColumn()
    id: string;

    @Column()
    productId: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column(
        {
            type: 'enum',
            enum: ['CREATED', 'PAID', 'CANCELLED'],
            default: 'CREATED',
        })
    status: OrderStatus;

    @Column(
        {
            type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'

        })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}
