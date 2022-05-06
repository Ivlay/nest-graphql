import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';
import { Post } from 'src/posts/schemas/post.schemas';

export type CommentDocument = Comment & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Comment {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @Field()
  @Prop()
  username: string;

  @Field(() => ID)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Post.name,
  })
  postId: string;

  @Field()
  @Prop({ required: true })
  body: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
