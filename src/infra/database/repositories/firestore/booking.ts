import { provide } from 'inversify-binding-decorators';
import { Booking } from '@/domain';
import { BookingMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IBookingRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IBookingEntity } from '@/src/domain/types';

@provide(TYPES.BookingRepository)
export class BookingRepository extends BaseRepository<Booking> implements IBookingRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.Booking;
    }

    /**
     * Map fields to domain entity
     * @param booking Entity raw field
     * @returns domain
     */
    protected toDomain(booking: Booking): Booking {
        return BookingMapper.toDomain(booking);
    }

    /**
     * Serialize domain entity
     * @param booking Entity object
     * @returns serialize
     */
    protected serialize(booking: Booking): IBookingEntity {
        return booking.serialize();
    }
}
