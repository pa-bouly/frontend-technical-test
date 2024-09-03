import {
  MemeResponseData,
  CommentResponseData,
  GetUserByIdResponse,
} from './ApiTypes';

export type CommentWithAuthor = CommentResponseData & {
  author: GetUserByIdResponse;
};

export type MemeData = {
  meme: MemeResponseData;
  author: GetUserByIdResponse;
};

export interface InfiniteQuery<T> {
  nextPage?: number;
  data: Array<T>;
}

export interface DragMemeText {
  type: string
  id: string
  top: number
  left: number
}

export type MemesFeedPage = InfiniteQuery<MemeData>;
export type CommentsFeedPage = InfiniteQuery<CommentWithAuthor>;
