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
exports.addDeployAzure = exports.ngAdd = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const schematics_1 = require("@angular-devkit/schematics");
const confirm_1 = require("../util/prompt/confirm");
const auth_1 = require("../util/azure/auth");
const subscription_1 = require("../util/azure/subscription");
const resource_group_1 = require("../util/azure/resource-group");
const account_1 = require("../util/azure/account");
const angular_json_1 = require("../util/workspace/angular-json");
const azure_json_1 = require("../util/workspace/azure-json");
function ngAdd(_options) {
    return (tree, _context) => {
        return schematics_1.chain([addDeployAzure(_options)])(tree, _context);
    };
}
exports.ngAdd = ngAdd;
function addDeployAzure(_options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        const project = new angular_json_1.AngularWorkspace(tree, _options);
        const azureJson = azure_json_1.readAzureJson(tree);
        const hostingConfig = azureJson ? azure_json_1.getAzureHostingConfig(azureJson, project.projectName) : null;
        if (!hostingConfig || (yield confirm_1.confirm(`Overwrite existing Azure config for ${project.projectName}?`))) {
            let auth = {};
            let subscription = '';
            if (process.env['CI']) {
                _context.logger.info(`CI mode detected`);
                auth = yield auth_1.loginToAzureWithCI(_context.logger);
                // the AZURE_SUBSCRIPTION_ID variable is validated inside the loginToAzureWithCI
                // so we have the guarrantee that the value is not empty.
                subscription = process.env.AZURE_SUBSCRIPTION_ID;
                // make sure the project property is set correctly
                // this is needed when creating a storage account
                _options = Object.assign(Object.assign({}, _options), { project: project.projectName });
            }
            else {
                auth = yield auth_1.loginToAzure(_context.logger);
                subscription = yield subscription_1.selectSubscription(auth.subscriptions, _options, _context.logger);
            }
            const credentials = auth.credentials;
            const resourceGroup = yield resource_group_1.getResourceGroup(credentials, subscription, _options, _context.logger);
            const client = account_1.getAzureStorageClient(credentials, subscription);
            const account = yield account_1.getAccount(client, resourceGroup, _options, _context.logger);
            const appDeployConfig = {
                project: project.projectName,
                target: project.target,
                configuration: project.configuration,
                path: project.path,
            };
            const azureDeployConfig = {
                subscription,
                resourceGroupName: resourceGroup.name,
                account,
            };
            // TODO: log url for account at Azure portal
            azure_json_1.generateAzureJson(tree, appDeployConfig, azureDeployConfig);
        }
        project.addLogoutArchitect();
        project.addDeployArchitect();
    });
}
exports.addDeployAzure = addDeployAzure;
//# sourceMappingURL=index.js.map