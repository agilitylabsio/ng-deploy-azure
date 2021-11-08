"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = exports.locations = exports.defaultLocation = void 0;
exports.defaultLocation = {
    id: 'westus',
    name: 'West US',
};
exports.locations = [
    {
        id: 'eastasia',
        name: 'East Asia',
    },
    {
        id: 'southeastasia',
        name: 'Southeast Asia',
    },
    {
        id: 'centralus',
        name: 'Central US',
    },
    {
        id: 'eastus',
        name: 'East US',
    },
    {
        id: 'eastus2',
        name: 'East US 2',
    },
    {
        id: 'westus',
        name: 'West US',
    },
    {
        id: 'northcentralus',
        name: 'North Central US',
    },
    {
        id: 'southcentralus',
        name: 'South Central US',
    },
    {
        id: 'northeurope',
        name: 'North Europe',
    },
    {
        id: 'westeurope',
        name: 'West Europe',
    },
    {
        id: 'japanwest',
        name: 'Japan West',
    },
    {
        id: 'japaneast',
        name: 'Japan East',
    },
    {
        id: 'brazilsouth',
        name: 'Brazil South',
    },
    {
        id: 'australiaeast',
        name: 'Australia East',
    },
    {
        id: 'australiasoutheast',
        name: 'Australia Southeast',
    },
    {
        id: 'southindia',
        name: 'South India',
    },
    {
        id: 'centralindia',
        name: 'Central India',
    },
    {
        id: 'westindia',
        name: 'West India',
    },
    {
        id: 'canadacentral',
        name: 'Canada Central',
    },
    {
        id: 'canadaeast',
        name: 'Canada East',
    },
    {
        id: 'uksouth',
        name: 'UK South',
    },
    {
        id: 'ukwest',
        name: 'UK West',
    },
    {
        id: 'westcentralus',
        name: 'West Central US',
    },
    {
        id: 'westus2',
        name: 'West US 2',
    },
    {
        id: 'koreacentral',
        name: 'Korea Central',
    },
    {
        id: 'koreasouth',
        name: 'Korea South',
    },
    {
        id: 'francecentral',
        name: 'France Central',
    },
    {
        id: 'southafricanorth',
        name: 'South Africa North',
    },
];
function getLocation(locationName) {
    if (!locationName) {
        return;
    }
    return exports.locations.find((location) => {
        return location.id === locationName || location.name === locationName;
    });
}
exports.getLocation = getLocation;
//# sourceMappingURL=locations.js.map