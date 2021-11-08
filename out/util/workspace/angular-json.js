"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularWorkspace = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
class AngularWorkspace {
    constructor(tree, options) {
        this.tree = tree;
        this.workspacePath = this.getPath();
        this.content = this.getContent();
        this.schema = this.getWorkspace();
        this.projectName = this.getProjectName(options);
        this.project = this.getProject(options);
        this.target = 'build'; // TODO allow configuration of other options
        this.configuration = 'production';
        this.path = this.project.architect
            ? this.project.architect[this.target].options.outputPath
            : `dist/${this.projectName}`;
    }
    getPath() {
        const possibleFiles = ['/angular.json', '/.angular.json'];
        const path = possibleFiles.filter((file) => this.tree.exists(file))[0];
        return path;
    }
    getContent() {
        const configBuffer = this.tree.read(this.workspacePath);
        if (configBuffer === null) {
            throw new schematics_1.SchematicsException(`Could not find angular.json`);
        }
        return configBuffer.toString();
    }
    getWorkspace() {
        let schema;
        try {
            schema = core_1.parseJson(this.content, core_1.JsonParseMode.Loose);
        }
        catch (e) {
            throw new schematics_1.SchematicsException(`Could not parse angular.json: ` + e.message);
        }
        return schema;
    }
    getProjectName(options) {
        let projectName = options.project;
        if (!projectName) {
            if (this.schema.defaultProject) {
                projectName = this.schema.defaultProject;
            }
            else {
                throw new schematics_1.SchematicsException('No project selected and no default project in the workspace');
            }
        }
        return projectName;
    }
    getProject(options) {
        const project = this.schema.projects[this.projectName];
        if (!project) {
            throw new schematics_1.SchematicsException('Project is not defined in this workspace');
        }
        if (project.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Deploy requires a project type of "application" in angular.json`);
        }
        if (!project.architect ||
            !project.architect.build ||
            !project.architect.build.options ||
            !project.architect.build.options.outputPath) {
            throw new schematics_1.SchematicsException(`Cannot read the output path (architect.build.options.outputPath) of project "${this.projectName}" in angular.json`);
        }
        return project;
    }
    getArchitect() {
        if (!this || !this.project || !this.project.architect) {
            throw new schematics_1.SchematicsException('An error has occurred while retrieving project configuration.');
        }
        return this.project.architect;
    }
    updateTree() {
        this.tree.overwrite(this.workspacePath, JSON.stringify(this.schema, null, 2));
    }
    addLogoutArchitect() {
        this.getArchitect()['azureLogout'] = {
            builder: '@azure/ng-deploy:logout',
        };
        this.updateTree();
    }
    addDeployArchitect() {
        this.getArchitect()['deploy'] = {
            builder: '@azure/ng-deploy:deploy',
            options: {
                host: 'Azure',
                type: 'static',
                config: 'azure.json',
            },
        };
        this.updateTree();
    }
}
exports.AngularWorkspace = AngularWorkspace;
//# sourceMappingURL=angular-json.js.map