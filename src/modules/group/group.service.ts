// group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GroupEntity } from '../../entities/group.entity';
import { CreateGroupInput, UpdateGroupInput } from './dto/update-group.input';
import { PaginatedGroup } from './dto/paginated-group.dto';
import { BaseService } from 'src/common/bases/base.service';

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

//      // async create(input: CreateGroupInput): Promise<GroupEntity> {
//      //      const group = this.groupRepository.create({
//      //           name: input.name, // bắt buộc có
//      //           description: input.description,
//      //      });

//      //      if (input.parent_id != null) {
//      //           group.parent = { id: input.parent_id } as GroupEntity;
//      //      }

//      //      // if (input.roleIds?.length) {
//      //      //      group.roles = input.roleIds.map(id => ({ id } as Role));
//      //      // }

//      //      return this.groupRepository.save(group);
//      // }

//      async create(input: CreateGroupInput) {
//           const group = this.groupRepository.create({
//                name: input.name,
//                description: input.description,
//                parent: input.parent_id ? { id: input.parent_id } as GroupEntity : undefined,
//                role: input.role,
//           });
//           return this.groupRepository.save(group);
//      }

//      async update(id: number, input: UpdateGroupInput): Promise<GroupEntity> {
//           const group = await this.groupRepository.findOneOrFail({
//                where: { id }
//           });

//           if (input.name !== undefined) group.name = input.name;
//           if (input.description !== undefined) group.description = input.description;
//           if (input.role !== undefined) group.role = input.role;

//           return this.groupRepository.save(group);
//      }

//      // async update(
//      //      id: number,
//      //      input: UpdateGroupInput,
//      // ): Promise<GroupEntity> {
//      //      const group = await this.groupRepository.findOneOrFail({
//      //           where: { id },
//      //           relations: ['roles'], // load roles hiện tại nếu cần kiểm tra
//      //      });

//      //      if (input.name !== undefined) group.name = input.name;
//      //      if (input.description !== undefined) group.description = input.description;

//      //      if (input.parent_id !== undefined) {
//      //           group.parent = input.parent_id ? { id: input.parent_id } as GroupEntity : undefined;
//      //      }

//      //      // Xử lý roles: chỉ khi có roleIds mới gửi lên
//      //      // if (input.roleIds !== undefined) {
//      //      //      group.roles = input.roleIds.map(rid => {
//      //      //           const role = new Role();
//      //      //           role.id = rid;
//      //      //           return role;
//      //      //      });
//      //      // }

//      //      return this.groupRepository.save(group);
//      // }

//      async delete(id: number): Promise<void> {
//           await this.groupRepository.delete(id);
//      }
// }


@Injectable()
export class GroupService extends BaseService<GroupEntity> {
     constructor(
          @InjectRepository(GroupEntity)
          private readonly repo: Repository<GroupEntity>
     ) {
          super(repo);
     }

     // protected getSearchFields(): string[] {
     //      return ['name', 'description'];
     // }
}
