import 'reflect-metadata';
import express, { Application } from 'express';
import { init } from './init';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler';
import * as OpenApiValidator from 'express-openapi-validator';

async function setupRoutes(app: Application) {
    const { healthCheckController, fareRuleController, fareController } = await init();
    app.use('/healthcheck', healthCheckController.getRouter());
    app.use('/fare-rule', fareRuleController.getRouter());
    app.use('/fare', fareController.getRouter());
    // app.use('/url', urlController.getRouter());

}

export async function createApp(): Promise<Application> {
    const app = express();
    app.use(cors());
    // Enable JSON body parsing
    app.use(express.json());

    app.use(
        OpenApiValidator.middleware({
            apiSpec: './docs/openapi.yml',
            validateRequests: true, // (default)
            validateResponses: false, // false by default
        }),
    );

    // Setup Routes
    await setupRoutes(app);

    // Error handler
    app.use(errorHandler());

    return app;
};
