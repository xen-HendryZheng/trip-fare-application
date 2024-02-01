import { Request, Response, Router } from 'express';

export class HealthCheckController {

    private router: Router;
    constructor() {
        this.router = Router();
        this.router.get('/liveness', HealthCheckController.liveness);
    }

    getRouter(): Router {
        return this.router;
    };

    static liveness(_: Request, res: Response) {
        res.status(200).json({ message: 'OK' })
    }
}