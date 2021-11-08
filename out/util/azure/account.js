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
exports.createWebContainer = exports.createAccount = exports.getAccountKey = exports.getAccount = exports.getAzureStorageClient = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const arm_storage_1 = require("@azure/arm-storage");
const list_1 = require("../prompt/list");
const storage_blob_1 = require("@azure/storage-blob");
const schematics_1 = require("@angular-devkit/schematics");
const name_generator_1 = require("../prompt/name-generator");
const spinner_1 = require("../prompt/spinner");
const newAccountPromptOptions = {
    id: 'newAccount',
    message: 'Enter a name for the new storage account:',
    name: 'Create a new storage account',
    default: '',
    defaultGenerator: (_name) => Promise.resolve(''),
    validate: (_name) => Promise.resolve(true),
};
function getAzureStorageClient(credentials, subscriptionId) {
    return new arm_storage_1.StorageManagementClient(credentials, subscriptionId);
}
exports.getAzureStorageClient = getAzureStorageClient;
function getAccount(client, resourceGroup, options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        let accountName = options.account || '';
        let needToCreateAccount = false;
        spinner_1.spinner.start('Fetching storage accounts');
        const accounts = yield client.storageAccounts;
        spinner_1.spinner.stop();
        function getInitialAccountName() {
            const normalizedProjectNameArray = options.project.match(/[a-zA-Z0-9]/g);
            let normalizedProjectName = normalizedProjectNameArray ? normalizedProjectNameArray.join('') : '';
            /*
            ensures project name + 'static' does not overshoot 24 characters (which is the Azure requirement on an account name)
            additionally it needs to be lowercase (in case we have Angular project like e.g `ExampleApp`)
            */
            normalizedProjectName = normalizedProjectName.toLowerCase().substring(0, 18);
            return `ngd${normalizedProjectName}cxa`;
        }
        const initialName = getInitialAccountName();
        const generateDefaultAccountName = accountNameGenerator(client);
        const validateAccountName = checkNameAvailability(client, true);
        newAccountPromptOptions.default = initialName;
        newAccountPromptOptions.defaultGenerator = generateDefaultAccountName;
        newAccountPromptOptions.validate = validateAccountName;
        if (accountName) {
            const result = yield accounts.checkNameAvailability(accountName);
            if (!result.nameAvailable) {
                // account exists
                // TODO: check account configuration
                logger.info(`Using existing account ${accountName}`);
            }
            else {
                // create account with this name, if valid
                const valid = yield validateAccountName(accountName);
                if (!valid) {
                    accountName = (yield list_1.newItemPrompt(newAccountPromptOptions)).newAccount;
                }
                needToCreateAccount = true;
            }
        }
        else {
            // no account flag
            if (!options.manual) {
                // quickstart - create w/ default name
                accountName = yield generateDefaultAccountName(initialName);
                const availableResult = yield client.storageAccounts.checkNameAvailability(accountName);
                if (!availableResult.nameAvailable) {
                    logger.info(`Account ${accountName} already exist on subscription, using existing account`);
                }
                else {
                    needToCreateAccount = true;
                }
            }
        }
        if (needToCreateAccount) {
            spinner_1.spinner.start(`creating ${accountName}`);
            yield createAccount(accountName, client, resourceGroup.name, resourceGroup.location);
            spinner_1.spinner.succeed();
        }
        return accountName;
    });
}
exports.getAccount = getAccount;
function checkNameAvailability(client, warn) {
    return (account) => __awaiter(this, void 0, void 0, function* () {
        spinner_1.spinner.start();
        const availability = yield client.storageAccounts.checkNameAvailability(account);
        if (!availability.nameAvailable && warn) {
            spinner_1.spinner.fail(availability.message || 'chosen name is not available');
            return false;
        }
        else {
            spinner_1.spinner.stop();
            return true;
        }
    });
}
function accountNameGenerator(client) {
    return (name) => __awaiter(this, void 0, void 0, function* () {
        return yield name_generator_1.generateName(name, checkNameAvailability(client, false));
    });
}
function getAccountKey(account, client, resourceGroup) {
    return __awaiter(this, void 0, void 0, function* () {
        const accountKeysRes = yield client.storageAccounts.listKeys(resourceGroup, account);
        const accountKey = (accountKeysRes.keys || []).filter((key) => (key.permissions || '').toUpperCase() === 'FULL')[0];
        if (!accountKey || !accountKey.value) {
            process.exit(1);
            return '';
        }
        return accountKey.value;
    });
}
exports.getAccountKey = getAccountKey;
function createAccount(account, client, resourceGroupName, location) {
    return __awaiter(this, void 0, void 0, function* () {
        const poller = yield client.storageAccounts.beginCreate(resourceGroupName, account, {
            kind: 'StorageV2',
            location,
            sku: { name: 'Standard_LRS' },
        });
        yield poller.pollUntilFinished();
        spinner_1.spinner.start('Retrieving account keys');
        const accountKey = yield getAccountKey(account, client, resourceGroupName);
        if (!accountKey) {
            throw new schematics_1.SchematicsException('no keys retrieved for storage account');
        }
        spinner_1.spinner.succeed();
        spinner_1.spinner.start('Creating web container');
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
        yield createWebContainer(client, resourceGroupName, account, sharedKeyCredential);
        spinner_1.spinner.succeed();
    });
}
exports.createAccount = createAccount;
function createWebContainer(client, resourceGroup, account, sharedKeyCredential) {
    return __awaiter(this, void 0, void 0, function* () {
        const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
        yield blobServiceClient.setProperties({
            staticWebsite: {
                enabled: true,
                indexDocument: 'index.html',
                errorDocument404Path: 'index.html',
            },
        });
    });
}
exports.createWebContainer = createWebContainer;
//# sourceMappingURL=account.js.map