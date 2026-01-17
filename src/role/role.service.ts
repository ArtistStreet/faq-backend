import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
     constructor(
          @InjectRepository(RoleEntity)
          private readonly roleRepository: Repository<RoleEntity>,
     ) { }

     async findAll(): Promise<RoleEntity[]> {
          return this.roleRepository.find({
               order: { name: 'ASC' },
          });
     }

     async create(
          name: string,
     ): Promise<RoleEntity> {
          const group = await this.roleRepository.create({
               name,
          });
          return this.roleRepository.save(group);
     }

     async delete(id: number): Promise<void> {
          await this.roleRepository.delete(id);
     }
}
