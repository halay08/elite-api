import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { UserStatus, UserRole } from '@/domain/types';
import { ISeeding } from './seedingInterface';
import { User } from '@/domain';

@provide(TYPES.UserSeeding)
class UserSeeding implements ISeeding {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly _userRepository: IUserRepository
    ) {}

    async run() {
        const users = [
            {
                role: UserRole.STUDENT,
                email: 'kenziix@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Mr Kenziix',
                phoneNumber: '0938195827',
                username: 'kenziix',
                avatar: 'https://ca.slack-edge.com/T018R4JFELS-U018R4LCPFC-3e7f2fc0ab72-512',
                shortIntro:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                timezone: '+7',
                country: {
                    code: 'vn',
                    name: 'Vietnam'
                },
                language: {
                    code: 'vn',
                    name: 'Vietnam'
                }
            },
            {
                role: UserRole.TUTOR,
                email: 'halay08@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Khiem Le',
                phoneNumber: '0974183561',
                username: 'khiemle',
                avatar: 'https://ca.slack-edge.com/T018R4JFELS-U0193NY7JP3-g62ed382a224-512',
                shortIntro:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                videoIntro: 'https://www.youtube.com/watch?v=gvo2wABupiI',
                timezone: '+7',
                country: {
                    code: 'vn',
                    name: 'Vietnam'
                },
                language: {
                    code: 'vn',
                    name: 'Vietnam'
                }
            },
            {
                role: UserRole.TUTOR,
                email: 'vukhanhtruong@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Truong Vu',
                phoneNumber: '0988795915',
                username: 'truongvu',
                avatar: 'https://ca.slack-edge.com/T018R4JFELS-U018R4LGE3U-gec3bfccc13a-512',
                shortIntro:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
                videoIntro: 'https://www.youtube.com/watch?v=tKboZuXfozo',
                timezone: '+7',
                country: {
                    code: 'vn',
                    name: 'Vietnam'
                },
                language: {
                    code: 'vn',
                    name: 'Vietnam'
                }
            },
            {
                role: UserRole.TUTOR,
                email: 'thaophan266@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Thao Phan',
                phoneNumber: '0935192850',
                username: 'thaophan',
                avatar: 'https://ca.slack-edge.com/T018R4JFELS-U01AMPN0YQP-2917f17beced-512',
                shortIntro:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
                videoIntro: 'https://www.youtube.com/watch?v=D595bNLttPk',
                timezone: '+7',
                country: {
                    code: 'vn',
                    name: 'Vietnam'
                },
                language: {
                    code: 'vn',
                    name: 'Vietnam'
                }
            },
            {
                role: UserRole.TUTOR,
                email: 'thanhdat.itdn@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Thanh Dat',
                phoneNumber: '0703641513',
                username: 'thanhdat',
                avatar: 'https://ca.slack-edge.com/T018R4JFELS-U01B4GWNZ52-8d56e6c00be1-512',
                shortIntro:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
                videoIntro: 'https://www.youtube.com/watch?v=gXadLSFfRLk',
                timezone: '+7',
                country: {
                    code: 'vn',
                    name: 'Vietnam'
                },
                language: {
                    code: 'vn',
                    name: 'Vietnam'
                }
            }
        ];

        for (const user of users) {
            const existedUser = await this._userRepository.findBy('email', user.email);
            if (existedUser.length > 0) {
                console.log(`User ${user.email} already existed in the database`);
                continue;
            }

            const userModel: User = User.create(user);
            const newUser = await this._userRepository.create(userModel);
            const newUserEntity = newUser.serialize();
            console.log(`New user was created ${newUserEntity.id}`);
        }

        console.log('DONE!');
    }
}

export default UserSeeding;
