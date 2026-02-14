// group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GroupEntity } from '../../entities/group.entity';
import { CreateGroupInput, UpdateGroupInput } from './dto/update-group.input';
import { PaginatedGroup } from './dto/paginated-group.dto';
import { BaseService } from 'src/common/bases/base.service';
import { BasePaginationInput } from 'src/common/bases/base.input';
import { IPaginatedType } from 'src/common/bases/base.model';
import appConf from 'src/configs/app.conf';

interface FindAllOptions {
     search?: string;
     role?: number[];
     pagination?: { page: number; limit: number; };
}

// dinh nghia cac phuong thuc cua group
// @Injectable()
// export class GroupService {
//      constructor(
//           @InjectRepository(GroupEntity)
//           private readonly groupRepository: Repository<GroupEntity>,
//      ) { }

//      async findRootGroups(options: FindAllOptions = {}): Promise<PaginatedGroup> {
//           const { page = 1, limit = 5 } = options.pagination || {};
//           const skip = (page - 1) * limit;

//           const qb = this.groupRepository
//                .createQueryBuilder('group')
//                .where('group.parent_id IS NULL');

//           if (options.search) {
//                const searchTerm = `%${options.search.trim()}%`;
//                qb.andWhere('group.name ILIKE :search', { search: searchTerm });
//           }

//           if (options.role?.length) {
//                qb.andWhere('group.role IN (:...roles)', {
//                     roles: options.role,
//                });
//           }

//           const items = await qb
//                .skip(skip)
//                .take(limit)
//                .getMany();

//           const total = await qb.getCount();

//           return { items, total, page, limit };
//      }

//      async findChildren(parentId: number, options: FindAllOptions = {}): Promise<PaginatedGroup> {
//           const { page = 1, limit = 5 } = options.pagination || {};
//           const skip = (page - 1) * limit;

//           const qb = this.groupRepository
//                .createQueryBuilder('group')
//                .leftJoinAndSelect('group.parent', 'parent')
//                .leftJoinAndSelect('group.children', 'children')
//                .leftJoinAndSelect('children.children', 'grandChildren') // nếu cần load sâu
//                .where('group.parent_id = :parentId', { parentId });

//           // Tìm kiếm theo tên group (nếu có)
//           if (options.search) {
//                const searchTerm = `%${options.search.trim()}%`;
//                qb.andWhere('group.name ILIKE :search', { search: searchTerm });
//           }

//           if (options.role?.length) {
//                qb.andWhere('group.role IN (:...roles)', {
//                     roles: options.role,
//                });
//           }

//           const items = await qb
//                .skip(skip)
//                .take(limit)
//                .getMany();

//           const total = await qb.getCount();

//           return { items, total, page, limit };
//      }

//      async findAll(): Promise<GroupEntity[]> {
//           return this.groupRepository.find({
//                relations: ['parent', 'children'],
//                order: { name: 'ASC' },
//           });
//      }

//      // Có thể thêm các method khác
//      //   findOne(id: number): Promise<GroupEntity | null> {
//      //     return this.groupRepository.findOneBy({ id });
//      //   }

//      async findOneWithRoles(id: number): Promise<GroupEntity> {
//           const group = await this.groupRepository.findOne({
//                where: { id },
//                relations: ['roles'], // load full roles để có name
//           });

//           if (!group) {
//                throw new NotFoundException(`GroupEntity with ID ${id} not found`);
//           }

//           return group;
//      }




@Injectable()
export class GroupService extends BaseService<GroupEntity> {
     constructor(
          @InjectRepository(GroupEntity)
          private readonly repo: Repository<GroupEntity>
     ) {
          super(repo);
     }

     // async search(options: BasePaginationInput): Promise<IPaginatedType<GroupEntity>> {
     //      const query = this.buildQuery(options);

     //      const totalCount = await query.getCount();

     //      const limit = options.limit ?? appConf.PAGE_DEFAULT;
     //      const page = options.page ?? 1;
     //      const skip = (page - 1) * limit;

     //      const { entities, raw } = await query
     //           .skip(skip)
     //           .take(limit)
     //           .getRawAndEntities();

     //      entities.forEach((item, index) => {
     //           item.hasChildren = raw[index].hasChildren;
     //      });

     //      return {
     //           totalCount,
     //           totalPages: Math.ceil(totalCount / limit),
     //           currentPage: page,
     //           data: entities,
     //      };
     // }

     async findChildren(
          parentId: number,
          options: BasePaginationInput
     ): Promise<IPaginatedType<GroupEntity>> {

          const qb = this.repo
               .createQueryBuilder('entity')
               .where('entity.parent_id = :parentId', { parentId });

          // search
          if (options.search) {
               qb.andWhere('entity.name ILIKE :search', {
                    search: `%${options.search}%`,
               });
          }

          // filter role
          if (options.filters?.length) {
               options.filters.forEach((filter, index) =>
                    this.applyFilter(qb, filter, index)
               );
          }

          // count
          const totalCount = await qb.getCount();

          const limit = options.limit ?? 10;
          const page = options.page ?? 1;
          const skip = (page - 1) * limit;

          // 👇 lấy children + hasChildren
          qb.addSelect(subQuery => {
               return subQuery
                    .select('COUNT(1) > 0')
                    .from(GroupEntity, 'child')
                    .where('child.parent_id = entity.id');
          }, 'hasChildren');

          const { entities, raw } = await qb
               .skip(skip)
               .take(limit)
               .getRawAndEntities();

          entities.forEach((item, index) => {
               item.hasChildren = raw[index].hasChildren;
          });

          return {
               data: entities,
               totalCount,
               totalPages: Math.ceil(totalCount / limit),
               currentPage: page,
          };
     }

     // public override buildQuery(options: BasePaginationInput) {
     //      const { parentId } = options;

     //      // const query = super.buildQuery(options);

     //      if (parentId === undefined) {
     //           // lấy root
     //           query.andWhere('entity.parent_id IS NULL');
     //      } else {
     //           // lấy con của node
     //           query.andWhere('entity.parent_id = :parentId', { parentId });
     //      }

     //      query.addSelect(subQuery => {
     //           return subQuery
     //                .select('COUNT(1) > 0')
     //                .from(GroupEntity, 'child')
     //                .where('child.parent_id = entity.id');
     //      }, 'hasChildren');

     //      return query;
     // }
}
