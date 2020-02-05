interface IRequestOptions {
  method: 'POST' | 'GET';
  headers: { [key: string]: string };
  body?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const BASE_URL = `${(process.env.REACT_APP_API_URL || '').replace(/\/$/, '')}`;

const request = (
  url: string,
  method: IRequestOptions['method'],
  data?: { [key: string]: any }
) => {
  const options: IRequestOptions = { method, headers: defaultHeaders };
  // Set body if it's defined
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  // Wrap all the repetitive stuff and strup prefix slash so we don't have 2
  return fetch(`${BASE_URL}/${url.replace(/^\//, '')}`, options).then(resp =>
    resp.ok ? resp.json() : Promise.reject(resp)
  );
};

export default {
  post<T extends any>(
    url: string,
    data: { [key: string]: any } = {}
  ): Promise<T> {
    return request(url, 'POST', data);
  },

  get<T extends any>(url: string): Promise<T> {
    return request(url, 'GET');
  },
  createEventSource: (url: string) =>
    new EventSource(`${BASE_URL}/${url.replace(/^\//, '')}`)
};
