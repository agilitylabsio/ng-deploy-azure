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
exports.getAzureHostingConfig = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const architect_1 = require("@angular-devkit/architect");
const node_1 = require("@angular-devkit/core/node");
const core_1 = require("@angular-devkit/core");
const path_1 = require("path");
const fs_1 = require("fs");
const deploy_1 = require("./actions/deploy");
exports.default = architect_1.createBuilder((builderConfig, context) => __awaiter(void 0, void 0, void 0, function* () {
    // get the root directory of the project
    const root = core_1.normalize(context.workspaceRoot);
    //  NodeJsSyncHost - An implementation of the Virtual FS using Node as the backend, synchronously.
    const host = core_1.workspaces.createWorkspaceHost(new node_1.NodeJsSyncHost());
    const { workspace } = yield core_1.workspaces.readWorkspace(root, host);
    if (!context.target) {
        throw new Error('Cannot deploy the application without a target');
    }
    const project = workspace.projects.get(context.target.project);
    if (!project) {
        throw new Error(`Cannot find project ${context.target.project} in the workspace.`);
    }
    const azureProject = getAzureHostingConfig(context.workspaceRoot, context.target.project, builderConfig.config);
    if (!azureProject) {
        throw new Error(`Configuration for project ${context.target.project} was not found in azure.json.`);
    }
    try {
        yield deploy_1.default(context, path_1.join(context.workspaceRoot, project.root), azureProject);
    }
    catch (e) {
        context.logger.error('Error when trying to deploy: ');
        context.logger.error(e.message);
        return { success: false };
    }
    return { success: true };
}));
function getAzureHostingConfig(projectRoot, target, azureConfigFile) {
    const azureJson = JSON.parse(fs_1.readFileSync(path_1.join(projectRoot, azureConfigFile), 'UTF-8'));
    if (!azureJson) {
        throw new Error(`Cannot read configuration file "${azureConfigFile}"`);
    }
    const projects = azureJson.hosting;
    return projects.find((project) => project.app.project === target);
}
exports.getAzureHostingConfig = getAzureHostingConfig;
//# sourceMappingURL=deploy.builder.js.map