import { IUser } from '@/types/user';
import mongoose, {Schema, Document, Model, models} from 'mongoose';
import { Comment, Icomment, IcommentBase } from './comment';

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: Icomment[];
    likes?: string[];
}

export interface IPost  extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date; 
}

//Define the document methods (for each instance of the post)
interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: IcommentBase): Promise<void>;
    getAllComments(): Promise<Icomment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>
}

export interface IPostDocument extends IPost, IPostMethods{} //singular instance of a post.
interface IPostModel extends IPostStatics, Model<IPostDocument> {} //allPost

const PostSchema = new Schema<IPostDocument>({
    user: {
        userId: {type: String, required: true},
        userImage: {type: String, required: true},
        firstName: {type: String, required: true},
  	    lastName: {type: String},
    },

    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
    likes: { type: [String] },
},{ 
    timestamps: true 
}
)

PostSchema.methods.likePost = async function (userId: string){
    try{
        await this.updateOne({ $addToSet: {likes: userId}})
    }catch(error){
        console.log("Error while liking post", error)
    }
}

PostSchema.methods.unlikePost = async function (userId: string){
    try{
        await this.updateOne({ $pull: {likes: userId}})
    }catch(error){
        console.log("Error while unliking post", error)
    }
}

PostSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id })
    }catch(error) {
        console.log('Error while removing post', error)
    }
}

PostSchema.methods.commentOnPost = async function (commentToAdd: IcommentBase){
    try{
        const comment  = await Comment.create(commentToAdd)
        this.comment.push(comment._id)
        await this.save()
    }catch(error){
        console.log("Error while commenting on post", error)
    }
}

PostSchema.methods.getAllComments = async function () {
    try{
        await this.populate({
            path: "comments",
            options: {sort: { createdAt: -1} }, //sort comments by newest first
        })
        return this.comments;
    }catch(error){
        console.log("Error while getting all comments", error)
    }
}

PostSchema.statics.getAllPosts = async function () {
  try{
    const posts = await this.find()
    .sort({ createdAt: -1})
    .populate({
        path: "comments",
        options: {sort: { createdAt: -1}}, //sort comments by newest first
    })
    .lean(); //lean() to convert Mongoose object to plain JS object
    return posts.map((post: IPostDocument) =>({
        ...post,
        _id: post._id.toString(),
        comments: post.comments?.map((comment: Icomment)=> ({
            ...comment,
            _id: comment._id.toString(),
        })),
    }))
}catch(error){
    console.log("Error when getting all posts", error)
    }
}

export const Post = models.post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema)


      