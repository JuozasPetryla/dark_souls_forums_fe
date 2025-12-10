export interface PostAuthor {
  id: number;
  nickname: string;
  image: string | null;
}

export interface PostTopic {
  id: number;
  title: string;
  image?: string | null;
}

export interface PostResponse {
  id: number;
  title: string;
  summary: string | null;
  view_count: number;
  created_at: string;
  modified_at: string;
  author: PostAuthor;
  topic: PostTopic;
}

export interface PostDetail extends PostResponse {
  content: string;
  locked: boolean;
  modified: boolean;
}

export interface FavoritePost {
  favorite_id: number;
  added_at: string;
  post: PostResponse;
}
