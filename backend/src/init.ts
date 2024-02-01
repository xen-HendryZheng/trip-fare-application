import { FareController } from './controllers/fare-controller';
import { HealthCheckController } from './controllers/healthcheck-controller';
import { FareRuleController } from './controllers/fare-rule-controller';
import { FareService } from './services/fare-service';
import { RuleConfigService } from './services/rule-config-service';
export async function init(): Promise<Record<string, any>> {

    // Initialize Service
    const fareService = new FareService();
    const ruleConfigService = new RuleConfigService();

    // Initialize controllers
    const healthCheckController = new HealthCheckController();
    const fareRuleController = new FareRuleController(fareService, ruleConfigService);
    const fareController = new FareController(fareService);

    return { healthCheckController, fareRuleController, fareController };
}