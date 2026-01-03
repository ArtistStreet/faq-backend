// group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { Role } from 'src/entities/role.entity';
import { CreateGroupInput, UpdateGroupInput } from './dto/update-group.input';

// dinh nghia cac phuong thuc cua group
@Injectable()
export class GroupService {
     constructor(
          @InjectRepository(Group)
          private readonly groupRepository: Repository<Group>,
     ) { }

     async findRootGroups(): Promise<Group[]> {
          return this.groupRepository.find({
               where: { parent: IsNull() }, // hoặc { parent: IsNull() } nếu dùng TypeORM
               relations: ['roles', 'parent', 'children'], // nếu cần
          });
     }

     // group.service.ts
     async countChildren(parentId: number): Promise<number> {
          return this.groupRepository.count({
               where: { parent: { id: parentId } },
          });
     }

     async findChildren(parentId: number): Promise<Group[]> {
          return this.groupRepository.find({
               where: { parent: { id: parentId } },
               relations: [
                    'parent',
                    'children',
                    'roles',
                    'children.children', // để hiển thị số con ở cấp cháu
               ],
               order: { name: 'ASC' },
          });
     }

     async findAll(): Promise<Group[]> {
          return this.groupRepository.find({
               relations: ['parent', 'children'],
               order: { name: 'ASC' },
          });
     }

     // Có thể thêm các method khác
     //   findOne(id: number): Promise<Group | null> {
     //     return this.groupRepository.findOneBy({ id });
     //   }

     async findOneWithRoles(id: number): Promise<Group> {
          const group = await this.groupRepository.findOne({
               where: { id },
               relations: ['roles'], // load full roles để có name
          });

          if (!group) {
               throw new NotFoundException(`Group with ID ${id} not found`);
          }

          return group;
     }

     async create(input: CreateGroupInput): Promise<Group> {
          const group = this.groupRepository.create({
               name: input.name, // bắt buộc có
               description: input.description,
          });

          if (input.parent_id != null) {
               group.parent = { id: input.parent_id } as Group;
          }

          if (input.roleIds?.length) {
               group.roles = input.roleIds.map(id => ({ id } as Role));
          }

          return this.groupRepository.save(group);
     }

     // group.service.ts
     async update(
          id: number,
          input: UpdateGroupInput,
     ): Promise<Group> {
          const group = await this.groupRepository.findOneOrFail({
               where: { id },
               relations: ['roles'], // load roles hiện tại nếu cần kiểm tra
          });

          if (input.name !== undefined) group.name = input.name;
          if (input.description !== undefined) group.description = input.description;

          if (input.parent_id !== undefined) {
               group.parent = input.parent_id ? { id: input.parent_id } as Group : undefined;
          }

          // Xử lý roles: chỉ khi có roleIds mới gửi lên
          if (input.roleIds !== undefined) {
               group.roles = input.roleIds.map(rid => {
                    const role = new Role();
                    role.id = rid;
                    return role;
               });
          }

          return this.groupRepository.save(group);
     }

     async delete(id: number): Promise<void> {
          await this.groupRepository.delete(id);
     }
}
