import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Fare } from "./fare.entity";


@Entity()

export class RuleConfig {

    // id, rule_name, day, time_from, time_to
    @PrimaryColumn({ name: 'id', generated: true, type: 'int' })
    id: number;

    @Column({ name: 'rule_name', type: 'text' })
    rule_name: string;

    @Column({ name: 'day', type: 'text' })
    day: string;

    @Column({ name: 'time_from', type: 'int' })
    time_from: number;

    @Column({ name: 'time_to', type: 'int' })
    time_to: number;

    @Column({ name: 'active', type: 'boolean', default: true, nullable: true })
    active: boolean;

}