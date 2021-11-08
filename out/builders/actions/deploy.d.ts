import { BlobServiceClient } from '@azure/storage-blob';
import { BuilderContext } from '@angular-devkit/architect';
import { AzureHostingConfig } from '../../util/workspace/azure-json';
export default function deploy(context: BuilderContext, projectRoot: string, azureHostingConfig?: AzureHostingConfig): Promise<void>;
export declare function uploadFilesToAzure(serviceClient: BlobServiceClient, context: BuilderContext, filesPath: string, files: string[]): Promise<void>;
