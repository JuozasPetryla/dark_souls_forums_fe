export interface ThemeResponse {
    id: number;
    title: string;
    created_at: string;
    modified_at: string;
}

export interface ThemeRequest {
    title: string;
    image_link: string;
}