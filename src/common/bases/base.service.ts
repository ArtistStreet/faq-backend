import { DeepPartial, FindManyOptions, FindOptionsSelect, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { BaseInput, BasePaginationInput } from './base.input';
import { getSearchFields } from '../decorators/entity.decorators';
import { IPaginatedType } from './base.model';
import appConf from '../../configs/app.conf';

@Injectable()
export class BaseService<T extends { id: number }> {
     constructor(protected readonly repository: Repository<T>) { }

     async find(options?: FindManyOptions<T> | undefined): Promise<T[]> {
          return this.repository.find(options);
     }

     async findOne(id: number | FindOneOptions<T>): Promise<T | null> {
          if (typeof id === 'number') {
               return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
          }
          return this.repository.findOne(id);
     }

     async create(data: DeepPartial<T>): Promise<T>;
     async create(data: DeepPartial<T>[]): Promise<T[]>;
     async create(data: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]> {
          if (Array.isArray(data)) {
               data = data.map(({ id, ...rest }) => rest) as DeepPartial<T>[];
               const entities = this.repository.create(data as DeepPartial<T>[]);
               return await this.repository.save(entities);
          } else {
               data.id = undefined;
               const entity = this.repository.create(data as DeepPartial<T>);
               return await this.repository.save(entity);
          }
     }

     async updateOne(id: number | FindOneOptions<T>, data: QueryDeepPartialEntity<T>, relationsHandler?: (entity: T) => Promise<void>,): Promise<T> {
          const item = await this.findOne(id);
          if (!item) {
               throw new NotFoundException();
          }
          const cleanedData = Object.fromEntries(
               Object.entries(data).filter(([_, value]) => value !== undefined)
          ) as QueryDeepPartialEntity<T>;
          Object.assign(item, cleanedData);

          if (relationsHandler) {
               await relationsHandler(item);
          }
          return this.repository.save(item);
     }

     async updateBy(
          criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<T>,
          data: QueryDeepPartialEntity<T>
     ) {
          return this.repository.update(criteria, data);
     }

     async save(data: DeepPartial<T>): Promise<T>;
     async save(data: DeepPartial<T>[]): Promise<T[]>;
     async save(data: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]> {
          if (Array.isArray(data)) return this.repository.save(data);
          return this.repository.save(data);
     }

     async delete(id: number | FindOneOptions<T>): Promise<void> {
          const item = await this.findOne(id);
          if (!item) {
               throw new NotFoundException();
          }
          await this.repository.delete(item.id);
     }

     async softDelete(id: number | FindOneOptions<T>, deletedBy?: number): Promise<void> {
          const item = await this.findOne(id);
          if (!item) {
               throw new NotFoundException();
          }
          if (deletedBy && item.hasOwnProperty('deleted_by')) {
               await this.repository.update(item.id, {
                    deleted_at: new Date(),
                    deleted_by: item['deleted_by'],
               } as QueryDeepPartialEntity<T>);
          } else await this.repository.softDelete(item.id);
     }

     async getListField<K extends keyof T>(field: K, options?: FindManyOptions<T>): Promise<T[K][]> {
          return this.find({ select: [field] as unknown as FindOptionsSelect<T>, ...options }).then((items) =>
               items.map((item) => item[field])
          );
     }

     async getField<K extends keyof T>(field: K, options?: FindManyOptions<T>): Promise<T[K]> {
          return this.findOne({ select: [field] as unknown as FindOptionsSelect<T>, ...options }).then((item) => {
               if (!item) throw new NotFoundException();
               return item[field];
          });
     }

     async exists(id: number): Promise<boolean> {
          return this.repository.exists({ where: { id } } as FindManyOptions<T>);
     }

     async existsBy(criteria: FindOptionsWhere<T>): Promise<boolean> {
          return this.repository.existsBy(criteria);
     }

     async search(options: BasePaginationInput, relations: string[] = [],): Promise<IPaginatedType<T>> {
          const query = this.buildQuery(options);

          relations.forEach((relation) => {
               query.leftJoinAndSelect(`entity.${relation}`, relation);
          });

          const totalCount = await query.getCount();

          const limit = options.limit ?? appConf.PAGE_DEFAULT;
          const page = options.page ?? 1;
          const totalPages = Math.ceil(totalCount / limit);
          const skip = (page - 1) * limit;

          const data = await query.skip(skip).take(limit).getMany();

          return { totalCount, totalPages, currentPage: page, data } as IPaginatedType<T>;
     }

     async findAllBy(options: BaseInput): Promise<T[]> {
          return this.buildQuery(options).getMany();
     }

     /**
      * ✅ Hàm xây dựng query chung
      */
     public buildQuery(options: BaseInput | BasePaginationInput): SelectQueryBuilder<T> {
          const { search, filters, sort } = options;
          let query = this.repository.createQueryBuilder('entity');

          // ✅ Tìm kiếm theo keyword
          if (search) {
               const searchFields = this.getSearchFields();
               if (searchFields.length) {
                    query = query.andWhere(
                         `(${searchFields.map((field) => `entity.${field} ILIKE :search`).join(' OR ')})`,
                         { search: `%${search}%` }
                    );
               }
          }

          // ✅ Lọc dữ liệu
          if (filters?.length) {
               filters.forEach((filter, index) => this.applyFilter(query, filter, index));
          }

          // ✅ Sắp xếp dữ liệu
          if (sort) {
               const [field, direction] = sort.split(':');
               query = query.orderBy(`entity.${field}`, (direction?.toUpperCase() as 'ASC' | 'DESC') || 'ASC');
          } else {
               query = query.orderBy(`entity.id`, 'DESC');
          }

          return query;
     }

     /**
      * ✅ Hàm lấy danh sách trường cần tìm kiếm
      */
     protected getSearchFields(): string[] {
          const entity = this.repository.metadata.target;
          if (typeof entity !== 'function') throw new InternalServerErrorException();
          return getSearchFields(entity);
     }
     /**
      * ✅ Hàm áp dụng lọc dữ liệu, hỗ trợ relation và kiểm tra NULL
      */
     public applyFilter(query: SelectQueryBuilder<T>, filter: string, index: number) {
          const regex = /^(.+?):(=|!=|>=|<=|>|<|~|!~|\[]|!\[])\((.+)\)$/;
          const match = filter.match(regex);
          if (!match) return; // Bỏ qua nếu format không hợp lệ
          const [, field, operator, value] = match;
          const paramName = `filter_${field}_${index}`;
          // Kiểm tra nếu field là relation (có dấu chấm)
          let fieldPath = `entity.${field}`;
          if (field.includes('.')) {
               fieldPath = field; // dùng trực tiếp alias đã join
          }
          // if (field.includes('.')) {
          //      const parts = field.split('.');
          //      const column = parts.pop(); // Lấy tên cột cuối cùng
          //      // Tạo các JOIN cho từng cấp relation
          //      let currentAlias = 'entity';
          //      for (let i = 0; i < parts.length; i++) {
          //           const relationName = parts[i];
          //           const aliasName = parts.slice(0, i + 1).join('_'); // user_profile, user_profile_company
          //           // Kiểm tra nếu JOIN chưa tồn tại
          //           if (!query.expressionMap.joinAttributes.some((j) => j.alias.name === aliasName)) {
          //                query.leftJoin(`${currentAlias}.${relationName}`, aliasName);
          //           }
          //           currentAlias = aliasName;
          //      }
          //      fieldPath = `${currentAlias}.${column}`;
          // }
          // Xử lý trường hợp kiểm tra NULL
          if (value.toLowerCase() === 'null') {
               if (operator === '=') {
                    query.andWhere(`${fieldPath} IS NULL`);
               } else if (operator === '!=') {
                    query.andWhere(`${fieldPath} IS NOT NULL`);
               }
               return;
          }
          switch (operator) {
               case '[]': // IN
                    query.andWhere(`${fieldPath} IN (:...${paramName})`, { [paramName]: value.split(',') });
                    break;
               case '![]': // NOT IN
                    query.andWhere(`${fieldPath} NOT IN (:...${paramName})`, { [paramName]: value.split(',') });
                    break;
               case '~': // LIKE thay vì ILIKE
                    query.andWhere(`${fieldPath} LIKE :${paramName}`, { [paramName]: `%${value}%` });
                    break;
               case '!~': // NOT LIKE thay vì NOT ILIKE
                    query.andWhere(`${fieldPath} NOT LIKE :${paramName}`, { [paramName]: `%${value}%` });
                    break;
               default: // So sánh khác
                    query.andWhere(`${fieldPath} ${operator} :${paramName}`, { [paramName]: value });
          }
     }
}
