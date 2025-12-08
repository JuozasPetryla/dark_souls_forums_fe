import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");

        if (token) config.headers.Authorization = `Bearer ${token}`;
        else delete config.headers.Authorization;

        return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error("API Error:", error.response.status, error.response.data);
        } else {
          console.error("Network/Client Error:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(path: string, params?: AxiosRequestConfig["params"]): Promise<T> {
    return this.client.get<T>(path, { params }).then((res) => res.data);
  }

  post<T, B = unknown>(path: string, body?: B): Promise<T> {
    return this.client.post<T>(path, body).then((res) => res.data);
  }

  put<T, B = unknown>(path: string, body?: B): Promise<T> {
    return this.client.put<T>(path, body).then((res) => res.data);
  }

  delete<T>(path: string): Promise<T> {
    return this.client.delete<T>(path).then((res) => res.data);
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1");
