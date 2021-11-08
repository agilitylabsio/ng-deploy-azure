export interface PromptOptions {
    name?: string;
    message: string;
    default?: string;
    defaultGenerator?: (name: string) => Promise<string>;
    title?: string;
    validate?: any;
    id: string;
}
export interface ListItem {
    name: string;
    id?: string;
}
export declare function filteredList(list: ListItem[], listOptions: PromptOptions, newItemOptions?: PromptOptions): Promise<any>;
export declare function newItemPrompt(newItemOptions: PromptOptions): Promise<any>;
export declare function listPrompt(list: ListItem[], name: string, message: string): any;
