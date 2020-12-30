import { UserRole } from '@/domain/types';

/**
 * Check object is user or not
 */
const isObjectUser = (value: any) => {
    return typeof value?.role !== 'undefined' && [UserRole.TUTOR, UserRole.STUDENT].includes(value?.role);
};

/**
 * Map user document referennce to tutor or student.
 */
const mapUserRef = <T>(entity: T) => {
    const data: Record<string, any> = {
        ...(entity as any)
    };

    for (const [key, value] of Object.entries(data)) {
        if (value && isObjectUser(value)) {
            const metadata = value.metadata;
            delete value.metadata;
            data[key] = {
                ...metadata,
                user: value
            };
        }
    }

    return data;
};

export { mapUserRef };
