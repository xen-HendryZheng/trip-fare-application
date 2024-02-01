import { Request, Response, Router } from 'express';
import { FareService } from '../services/fare-service';
import { RuleConfigService } from '../services/rule-config-service';

export class FareRuleController {

    private router: Router;
    private fareService: FareService;
    private ruleConfigService: RuleConfigService;
    constructor(fareService: FareService, ruleConfigService: RuleConfigService) {
        this.router = Router();
        this.fareService = fareService;
        this.ruleConfigService = ruleConfigService;
        this.router.get('/list', this.getRule.bind(this));
        this.router.get('/cap', this.getFareCap.bind(this));
        this.router.get('/config', this.getRuleConfig.bind(this));
        this.router.post('/', this.createRule.bind(this));
        this.router.post('/cap', this.createFareCap.bind(this));
        this.router.post('/config', this.createRuleConfig.bind(this));
    }

    getRouter(): Router {
        return this.router;
    };

    async createRule(req: Request, res: Response) {
        const { line_from, line_to, fare_peak, fare_normal, active } = req.body;
        const result = await this.fareService.createFareList(line_from, line_to, fare_peak, fare_normal, active as boolean);
        res.status(200).json(result);
    }

    async createFareCap(req: Request, res: Response) {
        const { fare_id, cap_metadata, cap_days, cap_fare } = req.body;
        const result = await this.fareService.createFareCap(fare_id, cap_metadata, cap_days, cap_fare);
        res.status(200).json(result);
    }

    async createRuleConfig(req: Request, res: Response) {
        const { rule_name, day, time_from, time_to } = req.body;
        const timeFromInt = Number(time_from.replace(':', ''));
        const timeToInt = Number(time_to.replace(':', ''));
        const result = await this.ruleConfigService.createRuleConfig(rule_name, day, timeFromInt, timeToInt);
        res.status(200).json(result);
    }

    async getRule(req: Request, res: Response) {
        const result = await this.fareService.getFareLists();
        res.status(200).json(result);
    }

    async getFareCap(req: Request, res: Response) {
        const result = await this.fareService.getFareCaps();
        res.status(200).json(result)
    }

    async getRuleConfig(req: Request, res: Response) {
        const result = await this.ruleConfigService.getRuleConfigs();
        res.status(200).json(result)
    }

}