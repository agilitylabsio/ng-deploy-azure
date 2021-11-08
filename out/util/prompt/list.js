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
exports.listPrompt = exports.newItemPrompt = exports.filteredList = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const inquirer = require("inquirer");
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
function filteredList(list, listOptions, newItemOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!list || list.length === 0) {
            return newItemOptions && newItemPrompt(newItemOptions);
        }
        const displayedList = newItemOptions ? [newItemOptions, ...list] : list;
        const result = yield listPrompt(displayedList, listOptions.id, listOptions.message);
        if (newItemOptions && newItemOptions.id && result[listOptions.id].id === newItemOptions.id) {
            return newItemPrompt(newItemOptions);
        }
        return result;
    });
}
exports.filteredList = filteredList;
function newItemPrompt(newItemOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let item, valid = true;
        const defaultValue = newItemOptions.defaultGenerator
            ? yield newItemOptions.defaultGenerator(newItemOptions.default || '')
            : newItemOptions.default;
        do {
            item = yield inquirer.prompt({
                type: 'input',
                name: newItemOptions.id,
                default: defaultValue,
                message: newItemOptions.message,
            });
            if (newItemOptions.validate) {
                valid = yield newItemOptions.validate(item[newItemOptions.id]);
            }
        } while (!valid);
        return item;
    });
}
exports.newItemPrompt = newItemPrompt;
function listPrompt(list, name, message) {
    return inquirer.prompt({
        type: 'autocomplete',
        name,
        source: searchList(list),
        message,
    });
}
exports.listPrompt = listPrompt;
const isListItem = (elem) => {
    return elem.original === undefined;
};
function searchList(list) {
    return (_, input) => {
        return Promise.resolve(fuzzy
            .filter(input, list, {
            extract(el) {
                return el.name;
            },
        })
            .map((result) => {
            let original;
            if (isListItem(result)) {
                original = result;
            }
            else {
                original = result.original;
            }
            return { name: original.name, value: original };
        }));
    };
}
//# sourceMappingURL=list.js.map