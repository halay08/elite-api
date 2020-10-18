import User from '@/domain/user';

import IRepository from './repositoryInterface';

// eslint-disable-next-line
export default interface IUserRepository extends IRepository<User> {}
