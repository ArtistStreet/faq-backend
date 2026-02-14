// Interface để lưu thông tin sort cho relation
import { EntityMetadata } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

export interface RelationSortInfo {
    field: string;
    direction?: 'ASC' | 'DESC';
}

// Biến global để lưu sort context (request-scoped)
export const GLOBAL_RELATION_SORT_CONTEXT = new Map<string, Map<string, RelationSortInfo>>();

// Biến để lưu current request ID (sẽ được set bởi DataLoader)
let CURRENT_REQUEST_ID: string | null = null;

/**
 * ✅ Tạo unique request ID
 */
export function createRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ✅ Khởi tạo context cho request
 */
export function initRelationSortContext(requestId: string): void {
    GLOBAL_RELATION_SORT_CONTEXT.set(requestId, new Map());
    // Set current request ID
    CURRENT_REQUEST_ID = requestId;
}

/**
 * ✅ Get current request ID
 */
export function getCurrentRequestId(): string | null {
    return CURRENT_REQUEST_ID;
}

/**
 * ✅ Set sort context cho relation
 */
export function setRelationSortContext(
    requestId: string,
    entityName: string,
    sortField: string,
    sortDirection?: 'ASC' | 'DESC'
): void {
    const requestContext = GLOBAL_RELATION_SORT_CONTEXT.get(requestId);
    if (requestContext) {
        const key = `${entityName}_${sortField}`;
        requestContext.set(key, {
            field: sortField,
            direction: sortDirection || 'ASC',
        });
    }
}

/**
 * ✅ Get sort context cho relation
 */
export function getRelationSortContext(requestId: string, entityName: string): RelationSortInfo[] {
    const requestContext = GLOBAL_RELATION_SORT_CONTEXT.get(requestId);
    if (!requestContext) return [];

    const prefix = `${entityName}_`;

    const result: RelationSortInfo[] = [];

    for (const [key, value] of requestContext.entries()) {
        if (key.startsWith(prefix)) {
            result.push(value);
        }
    }

    return result;
}

/**
 * ✅ Clear sort context khi request kết thúc
 */
export function clearRelationSortContext(requestId: string): void {
    GLOBAL_RELATION_SORT_CONTEXT.delete(requestId);
}

/**
 * ✅ Parse sort string và set context cho relation nếu cần (sử dụng current request ID)
 */
export function parseSortAndSetContext(metadata: EntityMetadata, sortString?: string): void {
    const requestId = getCurrentRequestId();
    if (!requestId || !sortString) return;

    const [field, direction] = sortString.split(':');

    // Kiểm tra nếu field là relation (có dấu chấm)
    if (field.includes('.')) {
        const parts = field.split('.');
        const column = parts.pop();
        if (!column) throw new InternalServerErrorException(`Invalid sort field: ${field}`);
        let entityName = '';
        let _this = metadata;
        parts.forEach((p) => {
            const relation = _this.relations.find((r) => r.propertyPath === p);
            if (!relation) throw new InternalServerErrorException(`Relation not found: ${p}`);
            _this = relation.inverseEntityMetadata;
            entityName = _this.targetName;
        });
        // Set sort context cho relation đầu tiên
        setRelationSortContext(requestId, entityName, column, direction?.toUpperCase() as 'ASC' | 'DESC');
    }
}
