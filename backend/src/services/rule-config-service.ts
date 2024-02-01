import { AppDataSource } from "../data-source";
import { RuleConfig } from "../typeorm/entities/rule-config.entity";


export class RuleConfigService {

    private ruleConfigRepository = AppDataSource.getRepository(RuleConfig);
    constructor() { }

    async createRuleConfig(rule_name: string, day: string, time_from: number, time_to:number): Promise<RuleConfig> {
        const ruleConfig = new RuleConfig();
        ruleConfig.rule_name = rule_name;
        ruleConfig.day = day;
        ruleConfig.time_from = time_from;
        ruleConfig.time_to = time_to;
        return this.ruleConfigRepository.save(ruleConfig);
    }

    async getRuleConfigById(id: number): Promise<RuleConfig> {
        return this.ruleConfigRepository.findOneBy({ id });
    }

    async getRuleConfigs(): Promise<RuleConfig[]> {
        return this.ruleConfigRepository.find();
    }

}