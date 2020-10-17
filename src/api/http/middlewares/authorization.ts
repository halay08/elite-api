import * as express from 'express';
import httpContext from '@/api/http/helpers/httpContext';
import { fireauth } from '@/infra/auth/firebase/types';
import HttpStatus from 'http-status-codes';

/**
 * Authorizations factory
 * @returns
 */
function authorizationFactory() {
    return (config: { roles?: string[] }) => {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Check authorization.
            // The API authentication is the optional since some routes have no security. It means they're published for all users.
            // Ex., The Tutor List API, the guess users can view tutor grid page without login.
            // We may consider to use the backdoor or access_token to protect them.
            const context = httpContext(req);
            const principal: fireauth.IPrincipal = context.user as fireauth.IPrincipal;
            if (principal) {
                const authUser: fireauth.IPrincipalDetail = principal.details;
                if (authUser.user !== null) {
                    // Check role authorization
                    const roles: string[] = config.roles || [];
                    const authorized = await principal.isInRoles(roles);
                    if (authorized) {
                        next();
                        return;
                    }
                }
            }

            // If role is defined but not have authorization.
            if (config.roles) {
                res.status(HttpStatus.UNAUTHORIZED).end('Unauthorized');
            }

            next();
        };
    };
}

const authorize = authorizationFactory();

export default authorize;
