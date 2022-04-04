// type Post {
//   id           : ID!
//   body         : String!
//   userName     : String!
//   comments     : [Comment]!
//   likes        : [Like]!
//   likeCount    : Int!
//   commentCount : Int!
//   createdAt    : String!
//   updatedAt    : Date!
// }

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';

export type PostDocument = Post & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({
    unique: true,
    ref: 'users',
  })
  user: User;

  @Field()
  body: string;

  @Field(() => Number)
  commentsCount: number;

  @Field(() => Number)
  likesCount: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
