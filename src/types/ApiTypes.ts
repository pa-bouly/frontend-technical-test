export type LoginResponse = {
  jwt: string;
};

export type GetUserByIdResponse = {
  id: string;
  username: string;
  pictureUrl: string;
};

export type MemeResponseData = {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: {
    content: string;
    x: number;
    y: number;
  }[];
  createdAt: string;
};

export type GetMemesResponse = {
  total: number;
  pageSize: number;
  results: MemeResponseData[];
};

export type CommentResponseData = {
  id: string;
  authorId: string;
  memeId: string;
  content: string;
  createdAt: string;
};

export type GetMemeCommentsResponse = {
  total: number;
  pageSize: number;
  results: CommentResponseData[];
};

export type CreateCommentResponse = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  memeId: string;
};
