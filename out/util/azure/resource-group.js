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
exports.askLocation = exports.getResourceGroup = void 0;
const list_1 = require("../prompt/list");
const locations_1 = require("./locations");
const name_generator_1 = require("../prompt/name-generator");
const resource_group_helper_1 = require("./resource-group-helper");
const spinner_1 = require("../prompt/spinner");
const defaultLocation = {
    id: 'westus',
    name: 'West US',
};
const resourceGroupsPromptOptions = {
    id: 'resourceGroup',
    message: 'Under which resource group should we put this static site?',
};
const newResourceGroupsPromptOptions = {
    id: 'newResourceGroup',
    message: 'Enter a name for the new resource group:',
    name: 'Create a new resource group',
    default: '',
};
const locationPromptOptions = {
    id: 'location',
    message: 'In which location should the storage account be created?',
};
function getResourceGroup(creds, subscription, options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        let resourceGroupName = options.resourceGroup || '';
        let location = locations_1.getLocation(options.location);
        spinner_1.spinner.start('Fetching resource groups');
        const resourceGroupList = yield resource_group_helper_1.getResourceGroups(creds, subscription);
        spinner_1.spinner.stop();
        let result;
        const initialName = `ngdeploy-${options.project}-cxa`;
        const defaultResourceGroupName = yield resourceGroupNameGenerator(initialName, resourceGroupList);
        if (!options.manual) {
            // quickstart
            resourceGroupName = resourceGroupName || defaultResourceGroupName;
            location = location || defaultLocation;
        }
        if (!!resourceGroupName) {
            // provided or quickstart + default
            result = resourceGroupList.find((rg) => rg.name === resourceGroupName);
            if (!!result) {
                logger.info(`Using existing resource group ${resourceGroupName}`);
            }
        }
        else {
            // not provided + manual
            // TODO: default name can be assigned later, only if creating a new resource group.
            // TODO: check availability of the default name
            newResourceGroupsPromptOptions.default = defaultResourceGroupName;
            result = yield list_1.filteredList(resourceGroupList, resourceGroupsPromptOptions, newResourceGroupsPromptOptions);
            // TODO: add check whether the new resource group doesn't already exist.
            //  Currently throws an error of exists in a different location:
            //  Invalid resource group location 'westus'. The Resource group already exists in location 'eastus2'.
            result = result.resourceGroup || result;
            resourceGroupName = result.newResourceGroup || result.name;
        }
        if (!result || result.newResourceGroup) {
            location = location || (yield askLocation()); // if quickstart - location defined above
            spinner_1.spinner.start(`Creating resource group ${resourceGroupName} at ${location.name} (${location.id})`);
            result = yield resource_group_helper_1.createResourceGroup(resourceGroupName, subscription, creds, location.id);
            spinner_1.spinner.succeed();
        }
        return result;
    });
}
exports.getResourceGroup = getResourceGroup;
function askLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield list_1.filteredList(locations_1.locations, locationPromptOptions);
        return res.location;
    });
}
exports.askLocation = askLocation;
function resourceGroupExists(resourceGroupList) {
    return (name) => __awaiter(this, void 0, void 0, function* () {
        return Promise.resolve(!resourceGroupList.find((rg) => rg.name === name));
    });
}
function resourceGroupNameGenerator(initialName, resourceGroupList) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield name_generator_1.generateName(initialName, resourceGroupExists(resourceGroupList));
    });
}
//# sourceMappingURL=resource-group.js.map