import { RuleConfig } from "../typeorm/entities/rule-config.entity";
import { AppDataSource } from "../data-source";
import { FareCap } from "../typeorm/entities/fare-cap.entity";
import { Fare } from "../typeorm/entities/fare.entity";
import moment from 'moment';

export interface Trip {
    from: string;
    to: string;
    datetime: string;
}

export class FareService {

    private fareCapRepository = AppDataSource.getRepository(FareCap);
    private fareRepository = AppDataSource.getRepository(Fare);
    private ruleConfigRepository = AppDataSource.getRepository(RuleConfig);

    constructor() {

    }

    async calculateFare(line_from: string, line_to: string, datetime: string): Promise<{ fare: number, fare_item: Fare }> {
        const day = moment(datetime).format('dddd').toLowerCase(); // Monday
        const time = Number(moment(datetime).format('HH:mm').toString().replace(':', '')); // 14:00
        const fareItem = await this.fareRepository.findOneBy({ line_from, line_to, active: true });
        // throw error if fareItem is null
        if (!fareItem) {
            throw new Error('Fare not found');
        }
        // Query to ruleConfig where day = day and time between time_from and time_to use query builder
        const ruleConfig = await this.ruleConfigRepository.createQueryBuilder('rule_config')
            .where('rule_config.day = :day', { day })
            .andWhere(':time between time_from and time_to', { time })
            .andWhere('rule_config.active = :active', { active: true })
            .getOne();
        const fare = ruleConfig ? fareItem.fare_peak : fareItem.fare_normal;
        return { fare, fare_item: fareItem };
    }

    async calculateMultipleFares(Trips: Trip[]): Promise<number> {
        let totalFare = 0;
        let tripGroupByFareId: any = {};
        for (const trip of Trips) {
            const { fare, fare_item } = await this.calculateFare(trip.from, trip.to, trip.datetime);
            // group by fare_id and calculate total fare and store min and max datetime
            tripGroupByFareId[fare_item.id] = {
                total_fare: (tripGroupByFareId[fare_item.id] ? tripGroupByFareId[fare_item.id].total_fare : 0) + Number(fare),
                min_datetime: tripGroupByFareId[fare_item.id] ? (tripGroupByFareId[fare_item.id].min_datetime > trip.datetime ? trip.datetime : tripGroupByFareId[fare_item.id].min_datetime) : trip.datetime,
                max_datetime: tripGroupByFareId[fare_item.id] ? (tripGroupByFareId[fare_item.id].max_datetime < trip.datetime ? trip.datetime : tripGroupByFareId[fare_item.id].max_datetime) : trip.datetime,
            };
        }
        // loop through tripGroupByFareId and calculate fare cap
        for (const key in tripGroupByFareId) {
            let days = moment(tripGroupByFareId[key].max_datetime).diff(moment(tripGroupByFareId[key].min_datetime), 'days');
            days = days < 1 ? 1 : days
            const fareCap = await this.fareCapRepository.createQueryBuilder('fare_cap')
                .where('fare_cap.fare_id = :fareId', { fareId: Number(key) })
                .andWhere('fare_cap.active = :active', { active: true })
                .andWhere('fare_cap.cap_days <= :capDays', { capDays: days  })
                .getOne();
            if (fareCap) {
                if (days >= fareCap.cap_days) {
                    totalFare += Number(fareCap.cap_fare);
                } else {
                    totalFare += Number(tripGroupByFareId[key].total_fare);
                }
            } else {
                totalFare += Number(tripGroupByFareId[key].total_fare);
            }
        }

        return totalFare;
    }

    async createFareCap(fare_id_id: number, cap_metadata: string, cap_days: number, cap_fare: number): Promise<FareCap> {
        const fareCap = new FareCap();
        fareCap.fare_id = fare_id_id;
        fareCap.cap_metadata = cap_metadata;
        fareCap.cap_days = cap_days;
        fareCap.cap_fare = cap_fare;
        return this.fareCapRepository.save(fareCap);
    }

    async getFareCapById(id: number): Promise<FareCap> {
        return this.fareCapRepository.findOneBy({ id });
    }

    async getFareCaps(): Promise<FareCap[]> {
        return this.fareCapRepository.find({ relations: ['fare_item']});
    }

    async createFareList(line_from: string, line_to: string, fare_peak: number, fare_normal: number, active: boolean): Promise<Fare> {
        const fareList = new Fare();
        fareList.line_from = line_from;
        fareList.line_to = line_to;
        fareList.fare_peak = fare_peak;
        fareList.fare_normal = fare_normal;
        fareList.active = active;
        return this.fareRepository.save(fareList);
    }

    async getFareListById(id: number): Promise<Fare> {
        return this.fareRepository.findOneBy({ id });
    }

    async getFareLists(): Promise<Fare[]> {
        return this.fareRepository.find();
    }

}

