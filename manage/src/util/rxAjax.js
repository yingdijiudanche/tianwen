// 运用于 epics of redux
import { ajax } from 'rxjs/ajax';
import tokenHolder from './tokenHolder';
import baseConfig from './config';

const processUrlAndHeaders = (url, headers) => {
  // if (`${url}`.match(/^\/api\//)) { }
  const token = tokenHolder.get();
  if (token) {
    return {
      url: `${baseConfig.ApiDomain}${url}`,
      headers: {
        ...(token ? { Token: token, TimeStamp: new Date().getTime() } : {}),
        ...(headers && headers instanceof Object ? headers : {}),
      },
    };
  }
  return { url: `${baseConfig.ApiDomain}${url}`, headers };
};

export const getJSON = (url, headers) => {
  const processedUrlAndHeader = processUrlAndHeaders(url, headers);
  const { url: newUrl, headers: newHeaders } = processedUrlAndHeader;
  return ajax.getJSON(newUrl, newHeaders);
};

export const get = (url, headers, responseType) => {
  const processedUrlAndHeader = processUrlAndHeaders(url, headers);
  const { url: newUrl, headers: newHeaders } = processedUrlAndHeader;
  return ajax({
    url: newUrl,
    headers: newHeaders,
    responseType,
  });
};

export const post = (url, body, headers) => {
  const processedUrlAndHeader = processUrlAndHeaders(url, {
    ...(headers || {}),
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  const { url: newUrl, headers: newHeaders } = processedUrlAndHeader;
  return ajax.post(newUrl, body, newHeaders);
};

export const put = (url, body, headers) => {
  const processedUrlAndHeader = processUrlAndHeaders(url, {
    ...(headers || {}),
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  });
  const { url: newUrl, headers: newHeaders } = processedUrlAndHeader;
  return ajax.put(newUrl, body, newHeaders);
};

export const del = (url, headers) => {
  const processedUrlAndHeader = processUrlAndHeaders(url, headers);
  const { url: newUrl, headers: newHeaders } = processedUrlAndHeader;
  return ajax.delete(newUrl, newHeaders);
};
