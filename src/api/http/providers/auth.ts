import * as express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';

import { AuthService } from '@/src/app/services';
import TYPES from '@/src/types';
import { fireauth } from '@/infra/auth/firebase/types';

const authService = inject(TYPES.AuthService);

/**
 * Principal
 */
class Principal implements fireauth.IPrincipal {
    /**
     * Details  of principal
     */
    public details: fireauth.IPrincipalDetail;

    /**
     * Creates an instance of principal.
     * @param details
     */
    public constructor(details: any) {
        this.details = details;
    }

    /**
     * Determines whether authenticated is
     * @returns authenticated
     */
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(this.details.user !== null);
    }

    /**
     * Determines whether resource owner is
     * @param resourceId
     * @returns resource owner
     */
    public isResourceOwner(resourceId: any): Promise<boolean> {
        // TODO:
        return Promise.resolve(resourceId === 1111);
    }

    /**
     * Determines whether in role is
     * @param role
     * @returns in role
     */
    public isInRole(role: string): Promise<boolean> {
        const userRole: string = this.details.user.customClaims?.role;
        return Promise.resolve(role === userRole);
    }

    /**
     * Determines whether in roles is
     * @param roles
     * @returns in roles
     */
    public isInRoles(roles: string[]): Promise<boolean> {
        const userRole: string = this.details.user.customClaims?.role;
        return Promise.resolve(roles.includes(userRole));
    }

    /**
     * Determines whether banned is
     * @returns banned
     */
    public isDisabled(): Promise<boolean> {
        return Promise.resolve(this.details.user.disabled);
    }
}

@injectable()
class AuthProvider implements interfaces.AuthProvider {
    @authService private readonly _authService: AuthService;

    /**
     * Gets user
     * @param req
     * @param res
     * @param next
     * @returns user
     */
    public async getUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<interfaces.Principal> {
        const details: any = {
            decodedIdToken: null,
            user: null
        };

        const bearerHeader = req.header('Authorization') || '';

        if (bearerHeader) {
            const bearer = bearerHeader.split(' ');
            const token = bearer[bearer.length - 1];
            try {
                // Get Decoded Id Token
                const decodedIdToken: fireauth.IDecodedIdToken = await this._authService.verifyIdToken(token);
                const user: fireauth.IUserRecord = await this._authService.getUser(decodedIdToken.uid);

                details.decodedIdToken = decodedIdToken;
                details.user = user;
            } catch (e) {
                throw new Error(e.message);
            }
        }

        const principal = new Principal({ ...details });

        return principal;
    }
}

export default AuthProvider;
