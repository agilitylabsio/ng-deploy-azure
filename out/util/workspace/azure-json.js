"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAzureHostingConfig = exports.generateAzureJson = exports.readAzureJson = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const schematics_1 = require("@angular-devkit/schematics");
const azureJsonFile = 'azure.json';
function readAzureJson(tree) {
    return tree.exists(azureJsonFile) ? safeReadJSON(azureJsonFile, tree) : null;
}
exports.readAzureJson = readAzureJson;
function generateAzureJson(tree, appDeployConfig, azureDeployConfig) {
    const azureJson = readAzureJson(tree) || emptyAzureJson();
    const existingHostingConfigIndex = getAzureHostingConfigIndex(azureJson, appDeployConfig.project);
    const hostingConfig = generateHostingConfig(appDeployConfig, azureDeployConfig);
    if (existingHostingConfigIndex >= 0) {
        azureJson.hosting[existingHostingConfigIndex] = hostingConfig;
    }
    else {
        azureJson.hosting.push(hostingConfig);
    }
    overwriteIfExists(tree, azureJsonFile, stringifyFormatted(azureJson));
}
exports.generateAzureJson = generateAzureJson;
function getAzureHostingConfig(azureJson, projectName) {
    return azureJson.hosting.find((config) => config.app.project === projectName);
}
exports.getAzureHostingConfig = getAzureHostingConfig;
function getAzureHostingConfigIndex(azureJson, project) {
    return azureJson.hosting.findIndex((config) => config.app.project === project);
}
const overwriteIfExists = (tree, path, content) => {
    if (tree.exists(path)) {
        tree.overwrite(path, content);
    }
    else {
        tree.create(path, content);
    }
};
const stringifyFormatted = (obj) => JSON.stringify(obj, null, 2);
function emptyAzureJson() {
    return {
        hosting: [],
    };
}
function safeReadJSON(path, tree) {
    try {
        const json = tree.read(path);
        if (!json) {
            throw new Error();
        }
        return JSON.parse(json.toString());
    }
    catch (e) {
        throw new schematics_1.SchematicsException(`Error when parsing ${path}: ${e.message}`);
    }
}
function generateHostingConfig(appDeployConfig, azureDeployConfig) {
    return {
        app: appDeployConfig,
        azureHosting: azureDeployConfig,
    };
}
//# sourceMappingURL=azure-json.js.map