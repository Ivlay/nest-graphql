import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  Scalar,
  CustomScalar,
  InputType,
  Int,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Kind, ValueNode } from 'graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';
import { Order, ORDERS } from '../dto/pagination-post-dto';

@ObjectType()
export class Like {
  @Field()
  createdAt: string;

  @Field()
  username: string;
}
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

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field()
  @Prop()
  username: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: string;

  @Field(() => [Like], { nullable: true })
  @Prop()
  likes: Like[];
}

@Scalar('Order')
export class OrderScalar implements CustomScalar<string, Order> {
  description = `Order value: ${ORDERS.ASC} or ${ORDERS.DESC}. Default value: ${ORDERS.DESC}, cause order by date`;

  serialize(value: Order) {
    if (value === 'asc' || value === 'desc') {
      return value;
    }

    return null;
  }

  parseValue(value: Order) {
    if (value === 'asc' || value === 'desc') {
      return value;
    }

    return null;
  }

  parseLiteral(valueNode: ValueNode) {
    if (valueNode.kind === Kind.STRING) {
      return String(valueNode.value) as Order;
    }

    return null;
  }
}

@InputType()
export class PaginationArgsPost {
  @Field(() => OrderScalar, { nullable: true, defaultValue: ORDERS.DESC })
  order: string;
  @Field({ nullable: true, defaultValue: 'createdAt' })
  orderBy: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = Post & Document;

PostSchema.index({ userId: 1 });
