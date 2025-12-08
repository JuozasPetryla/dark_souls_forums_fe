
type METHOD = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

interface Options extends RequestInit {
  body?: string;
}

interface APIResponse<T> {
  statusCode: number | null,
  body: T | null,
}

const callAPI = async <T>(url: string, authorize: boolean, options: Options): Promise<APIResponse<T>> => {
  const { body, ...restOptions } = options;

  const token = authorize ? getToken() : null;

  let statusCode: number | null = null;
  let returnBody: T | null = null;
 
  try{
    const res = await fetch(url, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...(authorize && token ? { Authorization: `Bearer ${token}` } : {}),
        ...(restOptions.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    statusCode = res.status;

    const text = await res.text();
    if (text) {
      returnBody = JSON.parse(text) as T;
    }
  } catch (error) {
    return { statusCode: 500, body: null }
  }

  return { statusCode, body: returnBody};

}

const getToken = (): string | null => {
  return localStorage.getItem("jwtToken");
}

export default callAPI;