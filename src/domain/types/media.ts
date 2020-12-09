import { IEntity, ITimestamp } from '.';

enum MediaType {
    PHOTO = 'photo',
    VIDEO = 'video',
    FILE = 'file'
}

type IMediaMeta = {
    name: string;

    value: string;
};

type IMedia = {
    name: string;

    // The unique identifier
    slug: string;

    url: string;

    type: MediaType;

    // Alt text, description, title of photos, video resolution,...
    metas?: IMediaMeta[];
};

/**
 * Media entity
 */
type IMediaEntity = IEntity & IMedia & ITimestamp;

export { IMedia, IMediaEntity, IMediaMeta, MediaType };
