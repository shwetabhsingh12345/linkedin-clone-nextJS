import { IUser } from '@/types/user';
import mongoose, {Schema, Document, Model, models} from 'mongoose';

export interface IcommentBase {
    user: IUser;
    text: string;
}

export interface Icomment extends Document, IcommentBase {
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<Icomment>({

    user: {
        userId: {type: String, required: true},
        userImage: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String}
    },
    text: {type: String, required: true},
},
    {timestamps: true}
)

export const Comment = models.Comment || mongoose.model<Icomment>("Comment", commentSchema)