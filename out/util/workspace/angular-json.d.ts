import { Tree } from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';
import { WorkspaceProject } from 'schematics-utilities';
import { WorkspaceTool } from '@angular-devkit/core/src/experimental/workspace';
export declare class AngularWorkspace {
    tree: Tree;
    workspacePath: string;
    schema: experimental.workspace.WorkspaceSchema;
    content: string;
    projectName: string;
    project: WorkspaceProject;
    target: string;
    configuration: string;
    path: string;
    constructor(tree: Tree, options: any);
    getPath(): string;
    getContent(): string;
    getWorkspace(): experimental.workspace.WorkspaceSchema;
    getProjectName(options: any): any;
    getProject(options: any): experimental.workspace.WorkspaceProject;
    getArchitect(): WorkspaceTool;
    updateTree(): void;
    addLogoutArchitect(): void;
    addDeployArchitect(): void;
}
