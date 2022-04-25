import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostSchema, OrderScalar } from './schemas/post.schemas';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { UsersModule } from 'src/users/users.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
    forwardRef(() => CommentsModule),
  ],
  providers: [PostsResolver, PostsService, OrderScalar],
  exports: [PostsService],
})
export class PostsModule {}
