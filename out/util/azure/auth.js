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
exports.loginToAzureWithCI = exports.loginToAzure = exports.clearCreds = exports.globalConfig = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const ms_rest_nodeauth_1 = require("@azure/ms-rest-nodeauth");
const adal_node_1 = require("adal-node");
const ms_rest_azure_env_1 = require("@azure/ms-rest-azure-env");
const Conf = require("conf");
const subscriptionUtils_1 = require("@azure/ms-rest-nodeauth/dist/lib/subscriptionManagement/subscriptionUtils");
const AUTH = 'auth';
exports.globalConfig = new Conf({
    defaults: {
        auth: null,
    },
    configName: 'ng-azure',
});
function clearCreds() {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.globalConfig.set(AUTH, null);
    });
}
exports.clearCreds = clearCreds;
/**
 * safe guard if things get wrong and we don't get an AUTH object.
 * we exit if:
 * - auth is not valid
 * - auth.credentials doesn't exist
 * - auth.credentials.getToken is not a function
 */
function safeCheckForValidAuthSignature(auth) {
    const isEmpty = (o) => Object.entries(o).length === 0;
    if (auth === null ||
        (auth && isEmpty(auth.credentials)) ||
        (auth && auth.credentials && typeof auth.credentials.getToken !== 'function')) {
        throw new Error(`There was an issue during the login process.\n
      Make sure to delete "${exports.globalConfig.path}" and try again.`);
    }
}
function loginToAzure(logger) {
    return __awaiter(this, void 0, void 0, function* () {
        // a retry login helper function
        const retryLogin = (_auth, tenant = '') => __awaiter(this, void 0, void 0, function* () {
            _auth = yield ms_rest_nodeauth_1.interactiveLoginWithAuthResponse(!!tenant ? { domain: tenant } : {});
            safeCheckForValidAuthSignature(_auth);
            if (!tenant && (!_auth.subscriptions || _auth.subscriptions.length === 0)) {
                logger.info(`Due to an issue regarding authentication with the wrong tenant, we ask you to log in again.`);
                const tenants = yield subscriptionUtils_1.buildTenantList(_auth.credentials);
                _auth = yield retryLogin(_auth, tenants[0]);
            }
            _auth.credentials = _auth.credentials;
            exports.globalConfig.set(AUTH, _auth);
            return _auth;
        });
        // check old AUTH config from cache
        let auth = (yield exports.globalConfig.get(AUTH));
        // if old AUTH config is not found, we trigger a new login flow
        if (auth === null) {
            auth = yield retryLogin(auth);
        }
        else {
            const creds = auth.credentials;
            const { clientId, domain, username, tokenAudience, environment } = creds;
            // if old AUTH config was found, we extract and check if the required fields are valid
            if (creds && clientId && domain && username && tokenAudience && environment) {
                const cache = new adal_node_1.MemoryCache();
                cache.add(creds.tokenCache._entries, () => { });
                // we need to regenerate a proper object from the saved credentials
                auth.credentials = new ms_rest_nodeauth_1.DeviceTokenCredentials(clientId, domain, username, tokenAudience, new ms_rest_azure_env_1.Environment(environment), cache);
                const token = yield auth.credentials.getToken();
                // if extracted token has expired, we request a new login flow
                if (new Date(token.expiresOn).getTime() < Date.now()) {
                    logger.info(`Your stored credentials have expired; you'll have to log in again`);
                    auth = yield retryLogin(auth);
                }
            }
            else {
                // if old AUTH config was found, but the required fields are NOT valid, we trigger a new login flow
                auth = yield retryLogin(auth);
            }
        }
        return auth;
    });
}
exports.loginToAzure = loginToAzure;
function loginToAzureWithCI(logger) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`Checking for configuration...`);
        const { CLIENT_ID, CLIENT_SECRET, TENANT_ID, AZURE_SUBSCRIPTION_ID } = process.env;
        if (CLIENT_ID) {
            logger.info(`Using CLIENT_ID=${CLIENT_ID}`);
        }
        else {
            throw new Error('CLIENT_ID is required in CI mode');
        }
        if (CLIENT_SECRET) {
            logger.info(`Using CLIENT_SECRET=${CLIENT_SECRET.replace(/\w/g, '*')}`);
        }
        else {
            throw new Error('CLIENT_SECRET is required in CI mode');
        }
        if (TENANT_ID) {
            logger.info(`Using TENANT_ID=${TENANT_ID}`);
        }
        else {
            throw new Error('TENANT_ID is required in CI mode');
        }
        if (AZURE_SUBSCRIPTION_ID) {
            logger.info(`Using AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}`);
        }
        else {
            throw new Error('AZURE_SUBSCRIPTION_ID is required in CI mode');
        }
        logger.info(`Configuration OK`);
        return yield ms_rest_nodeauth_1.loginWithServicePrincipalSecretWithAuthResponse(CLIENT_ID, CLIENT_SECRET, TENANT_ID);
    });
}
exports.loginToAzureWithCI = loginToAzureWithCI;
//# sourceMappingURL=auth.js.map