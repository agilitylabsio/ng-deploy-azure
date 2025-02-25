import { StorageManagementClient } from '@azure/arm-storage';
import { StorageSharedKeyCredential } from '@azure/storage-blob';
import { DeviceTokenCredentials } from '@azure/ms-rest-nodeauth';
import { AddOptions, Logger } from '../shared/types';
import { ResourceGroup } from './resource-group';
export declare function getAzureStorageClient(credentials: DeviceTokenCredentials, subscriptionId: string): StorageManagementClient;
export declare function getAccount(client: StorageManagementClient, resourceGroup: ResourceGroup, options: AddOptions, logger: Logger): Promise<string>;
export declare function getAccountKey(account: any, client: StorageManagementClient, resourceGroup: any): Promise<string>;
export declare function createAccount(account: string, client: StorageManagementClient, resourceGroupName: string, location: string): Promise<void>;
export declare function createWebContainer(client: StorageManagementClient, resourceGroup: any, account: any, sharedKeyCredential: StorageSharedKeyCredential): Promise<void>;
