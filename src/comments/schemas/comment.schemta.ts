// type Comment {
//   id        : ID!
//   createdAt : String!
//   userName  : String!
//   body      : String!
// }
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({
    unique: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'users',
  })
  username: string;

  @Field()
  body: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(Comment);
