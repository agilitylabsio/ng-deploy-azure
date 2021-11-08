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
exports.selectSubscription = void 0;
const inquirer_1 = require("inquirer");
function selectSubscription(subs, options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(subs)) {
            if (subs.length === 0) {
                throw new Error("You don't have any active subscriptions. " +
                    'Head to https://azure.com/free and sign in. From there you can create a new subscription ' +
                    'and then you can come back and try again.');
            }
            const subProvided = !!options.subscriptionId || !!options.subscriptionName;
            const foundSub = subs.find((sub) => {
                // TODO: provided id and name might be of different subscriptions or one with typo
                return sub.id === options.subscriptionId || sub.name === options.subscriptionName;
            });
            if (foundSub) {
                return foundSub.id;
            }
            else if (subProvided) {
                logger.warn(`The provided subscription ID does not exist.`);
            }
            if (subs.length === 1) {
                if (subProvided) {
                    logger.warn(`Using subscription ${subs[0].name} - ${subs[0].id}`);
                }
                return subs[0].id;
            }
            else {
                const { sub } = yield inquirer_1.prompt([
                    {
                        type: 'list',
                        name: 'sub',
                        choices: subs.map((choice) => ({
                            name: `${choice.name} – ${choice.id}`,
                            value: choice.id,
                        })),
                        message: 'Under which subscription should we put this static site?',
                    },
                ]);
                return sub;
            }
        }
        throw new Error('API returned no subscription IDs. It should. ' +
            "Log in to https://portal.azure.com and see if there's something wrong with your account.");
    });
}
exports.selectSubscription = selectSubscription;
//# sourceMappingURL=subscription.js.map