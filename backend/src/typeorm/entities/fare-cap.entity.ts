import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Fare } from "./fare.entity";


@Entity()

export class FareCap {

    // id, fare_id_id, cap_metadata, cap_days, cap_fare
    
    @PrimaryColumn({ name: 'id', generated: true, type: 'int' })
    id: number;

    @Column({ name: 'fare_id', type: 'int' })
    fare_id: number;

    @ManyToOne(() => Fare)
    @JoinColumn({ name: 'fare_id', referencedColumnName: 'id'})
    fare_item: Fare;

    @Column({ name: 'cap_metadata', type: 'text' })
    cap_metadata: string;

    @Column({ name: 'cap_days', type: 'int' })
    cap_days: number;

    @Column({ name: 'cap_fare', type: 'decimal' })
    cap_fare: number;

    @Column({ name: 'active', type: 'boolean', default: true, nullable: true })
    active: boolean;

}