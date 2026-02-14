import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import {
     RelationSortInfo,
     createRequestId,
     initRelationSortContext,
     getRelationSortContext as getGlobalRelationSortContext,
     clearRelationSortContext as clearGlobalRelationSortContext,
     GLOBAL_RELATION_SORT_CONTEXT,
} from '../common/utils/relation-sort.util';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderService {
     private loaders = new Map<string, DataLoader<number, any>>();
     private requestId: string;

     constructor(private readonly authService: AuthService) {
          // Tạo unique request ID
          this.requestId = createRequestId();
          // Khởi tạo context cho request này
          initRelationSortContext(this.requestId);
     }

     /**
      * ✅ Hàm get sort context cho relation
      */
     private getRelationSortContext(entityName: string): RelationSortInfo[] {
          return getGlobalRelationSortContext(this.requestId, entityName);
     }

     /**
      * ✅ Hàm clear sort context khi request kết thúc
      */
     public clearRelationSortContext(): void {
          clearGlobalRelationSortContext(this.requestId);
     }

     /**
      * ✅ Hàm tạo key duy nhất cho mỗi entity và relation
      */
     private getLoaderKey(entity: Function, relation?: string): string {
          return `${entity.name}_${relation ?? 'default'}`;
     }

     /**
      * ✅ Hàm lấy nested value từ object
      */
     private getNestedValue(obj: any, path: string): any {
          return path.split('.').reduce((current, key) => {
               return current && current[key] !== undefined ? current[key] : null;
          }, obj);
     }

     /**
      * ✅ Batch Load for One-to-One hoặc Many-to-One
      */
     public relationBatchOne<T>(entity: new () => T, relation?: string): DataLoader<number, T | null> {
          const key = this.getLoaderKey(entity);
          if (!this.loaders.has(key)) {
               const loader = new DataLoader<number, T | null>(async (itemIds: number[]) => {
                    const repo = this.authService.userRepo.manager.getRepository(entity);
                    if (relation) {
                         const items = await repo.find({
                              where: { [relation]: { id: In(itemIds) } },
                              relations: [relation],
                         });
                         const itemMap = new Map<number, T>();
                         for (const item of items) {
                              const relationId = (item as any)[relation]?.id;
                              if (relationId) {
                                   itemMap.set(relationId, item as T);
                              }
                         }
                         return itemIds.map((id) => itemMap.get(id) ?? null);
                    } else {
                         const items = await repo.find({ where: { id: In(itemIds) } });
                         const itemMap = new Map<number, T>();
                         for (const item of items) {
                              itemMap.set((item as any).id, item as T);
                         }
                         return itemIds.map((id) => itemMap.get(id) ?? null);
                    }
               });
               this.loaders.set(key, loader);
          }
          return this.loaders.get(key)!;
     }

     /**
      * ✅ Convert camelCase to snake_case
      */
     private camelToSnakeCase(str: string): string {
          return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
     }

     /**
      * ✅ Batch Load for One-to-Many
      */
     public relationBatchOneMany<T>(entity: new () => T, relation: string): DataLoader<number, T[]> {
          // Lấy sort context nếu có (array of sort fields)
          const sortContexts = this.getRelationSortContext(entity.name) || [];
          const key = this.getLoaderKey(entity, relation);
          if (!this.loaders.has(key)) {
               const loader = new DataLoader<number, T[]>(async (itemIds: number[]) => {
                    const repo = this.authService.userRepo.manager.getRepository(entity);
                    const relationColumnName = this.camelToSnakeCase(relation) + '_id';
                    const relationItems = await repo
                         .createQueryBuilder('entity')
                         .where(`entity.${relationColumnName} IN (:...ids)`, { ids: itemIds })
                         .getMany();
                    const itemMap = new Map<number, T[]>();
                    for (const id of itemIds) {
                         itemMap.set(id, []);
                    }
                    for (const item of relationItems) {
                         const relationPropertyName = this.camelToSnakeCase(relation) + '_id';
                         const relationId = (item as any)[relationPropertyName];
                         if (relationId && itemMap.has(relationId)) {
                              itemMap.get(relationId)?.push(item as T);
                         }
                    }
                    return itemIds.map((id) => {
                         const items = itemMap.get(id) || [];
                         if (sortContexts.length > 0) {
                              return items.sort((a, b) => {
                                   for (const sortContext of sortContexts) {
                                        const valueA = this.getNestedValue(a, sortContext.field);
                                        const valueB = this.getNestedValue(b, sortContext.field);
                                        if (valueA === valueB) continue;
                                        if (valueA === null || valueA === undefined) return 1;
                                        if (valueB === null || valueB === undefined) return -1;
                                        const order = sortContext.direction === 'DESC' ? -1 : 1;
                                        if (valueA < valueB) return -1 * order;
                                        if (valueA > valueB) return 1 * order;
                                   }
                                   return 0;
                              });
                         }
                         return items;
                    });
               });
               this.loaders.set(key, loader);
          }
          return this.loaders.get(key) as DataLoader<number, T[]>;
     }

     /**
      * ✅ Batch Load for Many-to-Many
      */
     public relationBatchManyMany<T>(entity: new () => T, relation: string): DataLoader<number, T[]> {
          // Lấy sort context nếu có (array of sort fields)
          const sortContexts = this.getRelationSortContext(entity.name) || [];
          const key = this.getLoaderKey(entity, relation);
          if (!this.loaders.has(key)) {
               const loader = new DataLoader<number, T[]>(async (itemIds: number[]) => {
                    const repo = this.authService.userRepo.manager.getRepository(entity);
                    const relationItems = await repo
                         .createQueryBuilder('entity')
                         .leftJoinAndSelect(`entity.${relation}`, 'relation')
                         .where(`relation.id IN (:...ids)`, { ids: itemIds })
                         .getMany();
                    const itemMap = new Map<number, T[]>();
                    for (const item of relationItems) {
                         for (const rel of (item as any)[relation] ?? []) {
                              if (!itemMap.has(rel.id)) {
                                   itemMap.set(rel.id, []);
                              }
                              itemMap.get(rel.id)?.push(item as T);
                         }
                    }
                    return itemIds.map((id) => {
                         const items = itemMap.get(id) || [];
                         if (sortContexts.length > 0) {
                              return items.sort((a, b) => {
                                   for (const sortContext of sortContexts) {
                                        const valueA = this.getNestedValue(a, sortContext.field);
                                        const valueB = this.getNestedValue(b, sortContext.field);
                                        if (valueA === valueB) continue;
                                        if (valueA === null || valueA === undefined) return 1;
                                        if (valueB === null || valueB === undefined) return -1;
                                        const order = sortContext.direction === 'DESC' ? -1 : 1;
                                        if (valueA < valueB) return -1 * order;
                                        if (valueA > valueB) return 1 * order;
                                   }
                                   return 0;
                              });
                         }
                         return items;
                    });
               });
               this.loaders.set(key, loader);
          }
          return this.loaders.get(key)!;
     }
}
