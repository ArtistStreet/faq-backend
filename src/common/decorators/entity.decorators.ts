export const SEARCH_KEY = 'search_fields';

export function SearchFields(fields: string[]) {
    return function (target: Function) {
        Reflect.defineMetadata(SEARCH_KEY, fields, target.prototype);
    };
}

export function getSearchFields(target: any): string[] {
    return Reflect.getMetadata(SEARCH_KEY, target.prototype) || [];
}
