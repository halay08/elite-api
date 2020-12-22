import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { UserStatus, UserRole, IUserEntity } from '@/domain/types';
import { ISeeding } from './seedingInterface';
import { User } from '@/domain';
import { AuthService } from '@/src/app/services';
import { fireauth } from '@/infra/auth/firebase/types';

@provide(TYPES.UserSeeding)
export class UserSeeding implements ISeeding {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository,
        @inject(TYPES.AuthService)
        private readonly authService: AuthService
    ) {}

    getUserData(): IUserEntity[] {
        return [
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
                },
                metadata: null as any
            },
            {
                role: UserRole.STUDENT,
                email: 'test@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Mr Test',
                phoneNumber: '0933185827',
                username: 'test',
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
                },
                metadata: null as any
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
                },
                metadata: null as any
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
                },
                metadata: null as any
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
                },
                metadata: null as any
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
                },
                metadata: null as any
            },
            {
                id: 'FczXcOMojxRLA43VMKMMpXhu9ny2',
                role: UserRole.STUDENT,
                email: 'thagdet96@gmail.com',
                status: UserStatus.ACTIVE,
                name: 'Khanh Hoa',
                phoneNumber: '0123456789',
                username: 'khanhhoa',
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
                },
                metadata: null as any
            }
        ];
    }

    async run() {
        const users = this.getUserData();

        for (const user of users) {
            const { email = '' } = user;

            // Check exist user in Firestore
            const existedUser = await this.userRepository.findBy('email', email);
            if (existedUser.length > 0) {
                console.log(`User ${email} already existed in the database`);
                continue;
            }

            // Check exist user in Authentication
            let authUser;
            try {
                authUser = await this.authService.getUserByEmail(email);
            } catch (err) {
                console.log(`Warning: ${err.message}`);
            }

            if (!authUser) {
                const props: fireauth.ICreateRequest = {
                    email,
                    displayName: user.name,
                    emailVerified: true,
                    photoURL: user.avatar,
                    password: '123123123'
                };

                // Create authentication user
                authUser = await this.authService.createUser(props);
                if (!authUser?.uid) {
                    throw new Error(`Couldn't create authentication user with email ${email}`);
                }
            }

            user.id = authUser.uid;

            // Set/update custom claim
            await this.authService.setCustomUserClaims(`${user.id}`, { role: user.role?.toString() });

            // Create Firestore user
            const userModel: User = User.create(user);
            const newUser = await this.userRepository.create(userModel);
            const newUserEntity = newUser.serialize();
            console.log(`New user was created ${newUserEntity.id}`);
        }

        console.log('DONE!');
    }
}
