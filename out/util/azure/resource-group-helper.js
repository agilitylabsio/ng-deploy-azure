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
exports.createResourceGroup = exports.getResourceGroups = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const arm_resources_1 = require("@azure/arm-resources");
function getResourceGroups(creds, subscription) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new arm_resources_1.ResourceManagementClient(creds, subscription);
        const resourceGroupList = (yield client.resourceGroups.list());
        return resourceGroupList;
    });
}
exports.getResourceGroups = getResourceGroups;
function createResourceGroup(name, subscription, creds, location) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: throws an error here if the subscription is wrong
        const client = new arm_resources_1.ResourceManagementClient(creds, subscription);
        const resourceGroupRes = yield client.resourceGroups.createOrUpdate(name, {
            location,
        });
        return resourceGroupRes;
    });
}
exports.createResourceGroup = createResourceGroup;
//# sourceMappingURL=resource-group-helper.js.map