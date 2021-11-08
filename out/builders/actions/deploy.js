"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesToAzure = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mime_types_1 = require("mime-types");
const storage_blob_1 = require("@azure/storage-blob");
const promiseLimit = require("promise-limit");
const ProgressBar = require("progress");
const arm_storage_1 = require("@azure/arm-storage");
const account_1 = require("../../util/azure/account");
const chalk = require("chalk");
const auth_1 = require("../../util/azure/auth");
function deploy(context, projectRoot, azureHostingConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.target) {
            throw new Error('Cannot run target deploy. Context is missing a target object.');
        }
        if (!azureHostingConfig) {
            throw new Error('Cannot find Azure hosting config for your app in azure.json');
        }
        if (!azureHostingConfig.app ||
            !azureHostingConfig.azureHosting ||
            !azureHostingConfig.azureHosting.subscription ||
            !azureHostingConfig.azureHosting.resourceGroupName ||
            !azureHostingConfig.azureHosting.account) {
            throw new Error('Azure hosting config is missing some details. Please run "ng add @azure/ng-deploy"');
        }
        let auth = {};
        if (process.env['CI']) {
            context.logger.info(`CI mode detected`);
            auth = yield auth_1.loginToAzureWithCI(context.logger);
        }
        else {
            auth = yield auth_1.loginToAzure(context.logger);
        }
        const credentials = yield auth.credentials;
        context.logger.info('Preparing for deployment');
        let filesPath = null;
        if (azureHostingConfig.app.target) {
            // build the project
            const target = {
                target: azureHostingConfig.app.target,
                project: context.target.project,
            };
            if (azureHostingConfig.app.configuration) {
                target.configuration = azureHostingConfig.app.configuration;
            }
            context.logger.info(`📦 Running "${azureHostingConfig.app.target}" on "${context.target.project}"`);
            const run = yield context.scheduleTarget(target);
            const targetResult = yield run.result;
            if (!targetResult.success) {
                throw new Error(`Target failed: ${targetResult.error}`);
            }
            filesPath = targetResult.outputPath;
            if (!filesPath) {
                if (azureHostingConfig.app.path) {
                    context.logger.warn(`Target was executed but does not provide a result file path.
        Fetching files from the path configured in azure.json: ${azureHostingConfig.app.path}`);
                    filesPath = path.join(projectRoot, azureHostingConfig.app.path);
                    console.log(filesPath);
                }
            }
        }
        else if (azureHostingConfig.app.path) {
            context.logger.info(`Fetching files from the path configured in azure.json: ${azureHostingConfig.app.path}`);
            filesPath = path.join(projectRoot, azureHostingConfig.app.path);
        }
        if (!filesPath) {
            throw new Error('No path is configured for the files to deploy.');
        }
        const files = yield getFiles(context, filesPath, projectRoot);
        if (files.length === 0) {
            throw new Error('Target did not produce any files, or the path is incorrect.');
        }
        const client = new arm_storage_1.StorageManagementClient(credentials, azureHostingConfig.azureHosting.subscription);
        const accountKey = yield account_1.getAccountKey(azureHostingConfig.azureHosting.account, client, azureHostingConfig.azureHosting.resourceGroupName);
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(azureHostingConfig.azureHosting.account, accountKey);
        const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${azureHostingConfig.azureHosting.account}.blob.core.windows.net`, sharedKeyCredential);
        yield uploadFilesToAzure(blobServiceClient, context, filesPath, files);
        const accountProps = yield client.storageAccounts.getProperties(azureHostingConfig.azureHosting.resourceGroupName, azureHostingConfig.azureHosting.account);
        const endpoint = accountProps.primaryEndpoints && accountProps.primaryEndpoints.web;
        context.logger.info(chalk.green(`see your deployed site at ${endpoint}`));
        // TODO: log url for account at Azure portal
    });
}
exports.default = deploy;
function getFiles(context, filesPath, _projectRoot) {
    return glob.sync(`**`, {
        ignore: ['.git', '.azez.json'],
        cwd: filesPath,
        nodir: true,
    });
}
function uploadFilesToAzure(serviceClient, context, filesPath, files) {
    return __awaiter(this, void 0, void 0, function* () {
        context.logger.info('preparing static deploy');
        const containerClient = serviceClient.getContainerClient('$web');
        const bar = new ProgressBar('[:bar] :current/:total files uploaded | :percent done | :elapseds | eta: :etas', {
            total: files.length,
        });
        bar.tick(0);
        yield promiseLimit(5).map(files, function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                const blockBlobClient = containerClient.getBlockBlobClient(file);
                const blobContentType = mime_types_1.lookup(file) || '';
                const blobContentEncoding = mime_types_1.charset(blobContentType) || '';
                yield blockBlobClient.uploadStream(fs.createReadStream(path.join(filesPath, file)), 4 * 1024 * 1024, 20, {
                    blobHTTPHeaders: {
                        blobContentType,
                        blobContentEncoding,
                    },
                    onProgress: (_progress) => bar.tick(1),
                });
            });
        });
        bar.terminate();
        context.logger.info('deploying static site');
    });
}
exports.uploadFilesToAzure = uploadFilesToAzure;
//# sourceMappingURL=deploy.js.map