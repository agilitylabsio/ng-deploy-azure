import { DeviceTokenCredentials } from '@azure/ms-rest-nodeauth';
import { StorageLocation } from './locations';
import { AddOptions, Logger } from '../shared/types';
export interface ResourceGroup {
    id: string;
    name: string;
    location: string;
}
export declare function getResourceGroup(creds: DeviceTokenCredentials, subscription: string, options: AddOptions, logger: Logger): Promise<ResourceGroup>;
export declare function askLocation(): Promise<StorageLocation>;
