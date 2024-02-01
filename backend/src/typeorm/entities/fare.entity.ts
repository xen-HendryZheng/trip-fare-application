import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class Fare {

    // id, line_from, line_to, rule_config_id, fare_peak, fare_normal, active
    @PrimaryColumn({ name: 'id', generated: true, type: 'int' })
    id: number;

    @Column({ name: 'line_from', type: 'text' })
    line_from: string;

    @Column({ name: 'line_to', type: 'text' })
    line_to: string;

    @Column({ name: 'fare_peak', type: 'decimal' })
    fare_peak: number;

    @Column({ name: 'fare_normal', type: 'decimal' })
    fare_normal: number;

    @Column({ name: 'active', type: 'boolean', default: true, nullable: true })
    active: boolean;

}
