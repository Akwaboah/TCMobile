import { AppDependencies } from "@di/types";
import { container } from "tsyringe";
import { ApiClient } from "./apiClient";
import { AuthenticationModel, BankAccountsModel } from "@domain/module";
import { LocalEncryptedCache, LocalEncryptedCacheImpl } from "@core/local";
import { CacheKey } from "@core/local/types";
import { SigninInput } from "@dto/Authentication.Model";

const resolvedApiClient = container.resolve<ApiClient>(
    AppDependencies.RemoteClient
);

const resolveEncryptedLocalStore = container.resolve<LocalEncryptedCache>(AppDependencies.LocalEncryptionCache);

const signIn = async (input: SigninInput): Promise<boolean> => {
    return resolvedApiClient.post<AuthenticationModel>('/token', false, input).then(resp =>
        resolveEncryptedLocalStore.addEntry<AuthenticationModel>(CacheKey.Auth, resp.data)
    ).catch(error => { throw error });
}

const getBankAccounts = async (params ? :{Account_No?: string, Customer_Id__Customer_Name?: string, page_size?: number}): Promise<BankAccountsModel> => {
    return resolvedApiClient.get<BankAccountsModel>('/bank-accounts', true, params).then(resp => {
        return resp.data;
    }).catch(error => { throw error });
}

const useMobileClient = (): ApiClient => resolvedApiClient;
const useLocalEncryptedCache = (): LocalEncryptedCacheImpl => resolveEncryptedLocalStore;

export { useMobileClient, useLocalEncryptedCache, signIn, getBankAccounts }