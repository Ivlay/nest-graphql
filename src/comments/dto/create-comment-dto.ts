import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  body: string;

  @Field(() => ID)
  postId: string;
}
