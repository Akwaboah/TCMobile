import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { inject, injectable } from 'tsyringe';
import { RemoteException } from '@core/exception';
import { LocalEncryptedCacheImpl } from '@core/local';
import { AppDependencies } from '@di/types';
import { AuthenticationModel } from '@domain/module';
import { CacheKey } from '@core/local/types';
import Token from '@core/util/Token';


export interface RemoteClient {
  post<T>(
    url: string,
    secured: boolean,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>>;

  put<T>(
    url: string,
    secured: boolean,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>>;

  get<T>(
    url: string,
    secured: boolean,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>>;

  delete<T>(
    url: string,
    secured: boolean,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>>;
}

@injectable()
export class ApiClient implements RemoteClient {
  private authModel?: AuthenticationModel;
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @inject(AppDependencies.AppConfig)
    private readonly appConfig: Record<string, any>,
    @inject(AppDependencies.LocalEncryptionCache)
    private readonly encryptedLocalStore: LocalEncryptedCacheImpl
  ) {
    const baseURL = this.appConfig.client.ikanet.authUrl;
    if (!baseURL) {
      console.warn(`[${this.constructor.name}]: baseURL not defined`);
    }
    this.axiosInstance = axios.create({ baseURL });
  }

  async getAxiosInstance(secured?: boolean): Promise<AxiosInstance> {

    if (secured) {
      await this.applyAuthInterceptor(this.axiosInstance);
    }
    return this.axiosInstance;
  }

  private async applyAuthInterceptor(axiosInstance: AxiosInstance) {

    axiosInstance.interceptors.request.use(async (req: any) => {
      this.authModel = await (
        this.encryptedLocalStore.getEntry<AuthenticationModel>()
      );
      const isExpired = Token.isTokenExpired(this.authModel?.access);
      console.debug('auth-interceptor-is-token-expired', isExpired);
      if (!isExpired) {
        req.headers.Authorization = `Bearer ${this.authModel?.access}`;
        return req;
      }

      const input = { refresh: this.authModel?.refresh! };

      const newAuthModel: AuthenticationModel = await this.refreshToken(input);
      this.encryptedLocalStore.addEntry(CacheKey.Auth, newAuthModel);
      req.headers.Authorization = `Bearer ${newAuthModel.access}`;
      return req;
    });
  }

  private async refreshToken(input: { refresh: string }): Promise<AuthenticationModel> {

    const refreshTokenApiClient = new ApiClient(this.appConfig, this.encryptedLocalStore);
    const response = await refreshTokenApiClient.post<AuthenticationModel>(
      'token/refresh',
      false,
      input
    );
    return response.data;
  }

  async request<T>(
    requestConfig: AxiosRequestConfig,
    secured?: boolean,
  ): Promise<AxiosResponse<T>> {
    if (!secured) {
      console.warn('no authorization on request');
    }
    try {
      const instance = await this.getAxiosInstance(secured);
      return await instance.request<T>(requestConfig);
    } catch (error: any) {
      return Promise.reject(this.parseError(error));
    }
  }

  protected parseError(err: AxiosError) {
    console.error(
      `[${this.constructor.name}]:request`,
      err?.response?.data || err.message,
    );
    return new RemoteException(err).getErrors();
  }

  get<T>(
    url: string,
    secured: boolean = false,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>> {
    return this.request(
      {
        method: 'GET',
        url: url,
        params,
        headers: headers,
      },
      secured,
    );
  }

  post<T>(
    url: string,
    secured: boolean = false,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>> {
    return this.request(
      {
        method: 'POST',
        data,
        url,
        params,
        headers,
      },
      secured,
    );
  }

  put<T>(
    url: string,
    secured: boolean = false,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>> {
    return this.request(
      {
        method: 'PUT',
        data,
        url,
        params,
        headers,
      },
      secured,
    );
  }

  delete<T>(
    url: string,
    secured: boolean = false,
    data?: any,
    params?: object,
    headers?: any,
  ): Promise<AxiosResponse<T>> {
    return this.request(
      {
        method: 'DELETE',
        data,
        url,
        headers,
      },
      secured,
    );
  }

}


