import { ListItem } from '../prompt/list';
import { DeviceTokenCredentials } from '@azure/ms-rest-nodeauth';
import { ResourceGroupsCreateOrUpdateResponse } from '@azure/arm-resources/esm/models';
export interface ResourceGroupDetails extends ListItem {
    id: string;
    name: string;
    properties?: any;
    location: string;
}
export declare function getResourceGroups(creds: DeviceTokenCredentials, subscription: string): Promise<ResourceGroupDetails[]>;
export declare function createResourceGroup(name: string, subscription: string, creds: DeviceTokenCredentials, location: string): Promise<ResourceGroupsCreateOrUpdateResponse>;
