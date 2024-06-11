/* eslint-disable no-useless-catch */
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosProgressEvent,
} from "axios";
import { redirect } from "react-router-dom";
import { LocalStorageService } from "@/helpers/local-storage-service";
import { BaseError } from "@/types/error.type";
import { logger } from "@/helpers/logger";
import ENV from "@/environments/environment.development.json";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const BaseUrl = ENV.BASE_ADMIN_API_URL + "/api/v1";

const baseUrl = BaseUrl;

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  responseType: "json",
});

instance.interceptors.request.use(
  (config: AdaptAxiosRequestConfig) => {
    const localStorageService = new LocalStorageService();
    const token = (localStorageService.get_accesstoken() as any)?.replaceAll(
      `"`,
      ""
    );

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
      //   config.headers["ngrok-skip-browser-warning"] = "69420";
    }
    logger.log("Request Interceptor:", config);
    return config;
  },
  (error: any) => {
    // Handle request error
    logger.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Modify the response data
    // For example, you can perform data transformations or error handling
    logger.log("Response Interceptor:", response);
    return response;
  },
  (error: any) => {
    // Handle response error
    if (error.response.status === 401) {
      redirect("/");
      return Promise.reject(error);
    } else {
      const err = new BaseError();
      err.error_message = error?.response?.data
        ? error?.response?.data
        : "Bad Response";
      err.error_code = String(error.response.status);
      logger.error("Response Interceptor Error:", err);
      return Promise.reject(err);
    }
  }
);

const init = () => {
  instance.defaults.headers["Cache-Control"] = "no-cache";
  // Access-Control-Allow-Origin: *
  instance.defaults.headers["Access-Control-Allow-Origin"] = "*";
  // instance.defaults.withCredentials = true;
};

const get = async (url: string) => {
  console.log(baseUrl);

  try {
    const { data } = await instance.get(url);
    return data;
  } catch (error) {
    throw error;
  }
};

const post = async (url: string, object: any) => {
  try {
    const { data } = await instance.post(url, object);
    return data;
  } catch (error) {
    throw error;
  }
};

const put = async (url: string, object: any) => {
  try {
    const { data } = await instance.put(url, object);
    return data;
  } catch (error) {
    throw error;
  }
};
//
const patch = async (url: string, object: any) => {
  try {
    const { data } = await instance.patch(url, object);
    return data;
  } catch (error) {
    throw error;
  }
};

const del = async (url: string, object: any) => {
  try {
    const { data } = await instance.delete(url, object);
    return data;
  } catch (error) {
    throw error;
  }
};

const upload = async (
  url: string,
  formData: any,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const { data } = await instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const api1 = {
  baseUrl,
  instance,
  init,
  get,
  post,
  put,
  del,
  upload,
  patch,
};

export default api1;
