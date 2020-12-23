import TYPES from '@/src/types';
import Container from '@/src/container';
import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { UserSeeding } from '@/infra/database/migration/seeding';

const userSeeding = functions
    .runWith(runtimeOptions)
    .region(region)
    .https.onCall(async (data, context) => {
        const seeding = Container.get<UserSeeding>(TYPES.UserSeeding);
        await seeding.run();
    });

export { userSeeding };
