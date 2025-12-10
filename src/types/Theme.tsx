export interface ThemeResponse {
  id: number;
  description: string;
  title: string;
  image: string;
  created_at: string;
  modified_at: string;
  author: TopicAuthor;
}

export interface TopicAuthor {
  id: number;
  nickname: string;
  image: string | null;
}

export interface ThemeRequest {
    title: string;
    description: string;
    image_link: string;
}