import { Tree } from '@angular-devkit/schematics';
export interface AzureDeployConfig {
    subscription: string;
    resourceGroupName: string;
    account: string;
}
export interface AppDeployConfig {
    project: string;
    target: string;
    path: string;
    configuration?: string;
}
export interface AzureHostingConfig {
    azureHosting: AzureDeployConfig;
    app: AppDeployConfig;
}
export interface AzureJSON {
    hosting: AzureHostingConfig[];
}
export declare function readAzureJson(tree: Tree): AzureJSON | null;
export declare function generateAzureJson(tree: Tree, appDeployConfig: AppDeployConfig, azureDeployConfig: AzureDeployConfig): void;
export declare function getAzureHostingConfig(azureJson: AzureJSON, projectName: string): AzureHostingConfig | undefined;
