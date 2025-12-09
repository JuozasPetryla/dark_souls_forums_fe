export interface ThemeResponse {
    id: number;
    description: string;
    title: string;
    created_at: string;
    modified_at: string;
}

export interface ThemeRequest {
    title: string;
    description: string;
    image_link: string;
}