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
exports.spin = exports.spinner = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const chalk = require("chalk");
const ora = require('ora');
exports.spinner = ora({
    text: 'Rounding up all the reptiles',
    spinner: {
        frames: [chalk.red('▌'), chalk.green('▀'), chalk.yellow('▐'), chalk.blue('▄')],
        interval: 100,
    },
});
function spin(msg) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            return __awaiter(this, arguments, void 0, function* () {
                exports.spinner.start(msg);
                let result;
                try {
                    result = yield originalMethod.apply(this, arguments);
                }
                catch (e) {
                    exports.spinner.fail(e);
                }
                exports.spinner.succeed();
                return result;
            });
        };
        return descriptor;
    };
}
exports.spin = spin;
//# sourceMappingURL=spinner.js.map