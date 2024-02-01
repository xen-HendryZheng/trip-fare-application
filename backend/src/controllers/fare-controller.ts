import { Router, Request, Response, NextFunction } from "express";
import { FareService } from "src/services/fare-service";


export class FareController {
    private router: Router;
    private fareService: FareService;

    constructor(fareService: FareService) {
        this.router = Router();
        this.fareService = fareService;
        this.router.post('/calculate', this.calculateFare.bind(this));
        this.router.post('/calculate-multiple', this.calculateMultipleFare.bind(this));
    }

    getRouter(): Router {
        return this.router;
    };

    async calculateFare(req: Request, res: Response, next: NextFunction) {
        try {
            const { from, to, datetime } = req.body;
            const { fare, fare_item } = await this.fareService.calculateFare(from.toLowerCase(), to.toLowerCase(), datetime);
            res.status(200).json({ fare, fare_item })
        } catch (error) {
            next(error);
        }

    }

    async calculateMultipleFare(req: Request, res: Response, next: NextFunction) {
        try {
            const trips = req.body;
            const total_fare = await this.fareService.calculateMultipleFares(trips);
            res.status(200).json({ total_fare })
        } catch (error) {
            next(error);
        }

    }
}