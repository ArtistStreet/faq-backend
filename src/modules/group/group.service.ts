// group.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { group } from 'console';

// dinh nghia cac phuong thuc cua group
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: ['parent', 'children'], // tải quan hệ nếu cần
      order: {
        id: 'ASC',
      },
    });
  }

  // Có thể thêm các method khác
  //   findOne(id: number): Promise<Group | null> {
  //     return this.groupRepository.findOneBy({ id });
  //   }

  async create(
    name: string,
    description?: string,
    parent_id?: number,
  ): Promise<Group> {
    const group = await this.groupRepository.create({
      name,
      description,
      parent_id,
    });
    return this.groupRepository.save(group);
  }

  async update(id: number, updateData: Partial<Group>): Promise<Group> {
    const updatedGroup = await this.groupRepository.preload({
      id,
      ...updateData,
    });

    if (!updatedGroup) {
      throw new Error(`${id} not found`);
    }

    return this.groupRepository.save(updatedGroup);
  }

  async delete(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
