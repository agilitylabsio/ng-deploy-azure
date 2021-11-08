import { DeviceTokenCredentials, AuthResponse } from '@azure/ms-rest-nodeauth';
import { TokenResponse } from 'adal-node';
import * as Conf from 'conf';
import { Logger } from '../shared/types';
export declare type TokenCredentials = DeviceTokenCredentials & {
    tokenCache: {
        _entries: TokenResponse[];
    };
};
interface GlobalConfig {
    auth: AuthResponse | null;
}
export declare const globalConfig: Conf<GlobalConfig>;
export declare function clearCreds(): Promise<void>;
export declare function loginToAzure(logger: Logger): Promise<AuthResponse>;
export declare function loginToAzureWithCI(logger: Logger): Promise<AuthResponse>;
export {};
