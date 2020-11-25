import { injectable } from 'inversify';
import { IDocumentReference } from '../infra/database/types';

import { Entity } from './entity';
import { ITutorEntity, IEducation, ICertificate, IContract, TutorStatus } from './types';

// Collection: tutors
@injectable()
export default class Tutor extends Entity<ITutorEntity> {
    constructor(props: ITutorEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: ITutorEntity): Tutor {
        const instance = new Tutor(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    get user(): IDocumentReference {
        return this.props.user;
    }

    get category(): IDocumentReference {
        return this.props.category;
    }

    get educations(): IEducation[] | undefined {
        return this.props.educations;
    }

    get expertises(): string[] | undefined {
        return this.props.expertises;
    }

    get certificates(): ICertificate[] | undefined {
        return this.props.certificates;
    }

    get contracts(): IContract[] | undefined {
        return this.props.contracts;
    }

    get followers(): number | undefined {
        return this.props.followers;
    }

    get happyUsers(): number | undefined {
        return this.props.happyUsers;
    }

    get reviews(): number | undefined {
        return this.props.reviews;
    }

    get serviceFee(): number | undefined {
        return this.props.serviceFee;
    }

    get activeStatus(): TutorStatus {
        return this.props.activeStatus;
    }
}
