import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Comment } from 'src/comments/schemas/comment.schemta';
import { User } from 'src/users/schemas/user.schemas';

@ObjectType()
@Schema({
  timestamps: true,
})
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  body: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  @Prop()
  username: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: string;

  @Field(() => [Comment], { nullable: true })
  @Prop()
  comments: [Comment];

  @Field(() => [Like], { nullable: true })
  @Prop()
  likes: [Like];
}

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: string;

  @Field()
  username: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = Post & Document;

PostSchema.index({ userId: 1 });
