export interface StorageLocation {
    id: string;
    name: string;
}
export declare const defaultLocation: {
    id: string;
    name: string;
};
export declare const locations: {
    id: string;
    name: string;
}[];
export declare function getLocation(locationName: string | undefined): {
    id: string;
    name: string;
} | undefined;
