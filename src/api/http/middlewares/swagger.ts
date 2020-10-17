import * as express from 'express';
import * as path from 'path';
import { express as swaggerExpress, SwaggerDefinitionConstant } from 'swagger-express-ts';

export default (app: express.Application) => {
    app.use(
        swaggerExpress({
            definition: {
                schemes: ['http', 'https'],
                info: {
                    title: 'Elite API',
                    version: '1.0'
                },
                securityDefinitions: {
                    basicAuth: {
                        type: SwaggerDefinitionConstant.Security.Type.BASIC_AUTHENTICATION
                    },
                    bearerHeader: {
                        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
                        in: SwaggerDefinitionConstant.Security.In.HEADER,
                        name: 'Bearer'
                    }
                },
                models: {},
                externalDocs: {
                    url: 'https://api-docs.elites.work'
                }
            }
        })
    );
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use('/api-docs/swagger', express.static(path.join(__dirname, '..', 'swagger')));
};
