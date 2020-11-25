import { IEntity, ITimestamp } from '.';

enum IMediaType {
    PHOTO = 'photo',
    VIDEO = 'video'
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

    type: IMediaType;

    // Alt text, description, title of photos, video resolution,...
    metas?: IMediaMeta[];
};

/**
 * Media entity
 */
type IMediaEntity = IEntity & IMedia & ITimestamp;

export { IMedia, IMediaEntity, IMediaMeta, IMediaType };
