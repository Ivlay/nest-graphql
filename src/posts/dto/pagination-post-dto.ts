import { Post } from '../schemas/post.schemas';

export type Order = 'asc' | 'desc';
export type OrderBy = Omit<Post, 'id' | 'userId'>;

export enum ORDERS {
  ASC = 'asc',
  DESC = 'desc',
}
