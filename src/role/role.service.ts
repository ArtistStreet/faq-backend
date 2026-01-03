import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
     constructor(
          @InjectRepository(Role)
          private readonly roleRepository: Repository<Role>,
     ) { }

     async findAll(): Promise<Role[]> {
          return this.roleRepository.find({
               order: { name: 'ASC' },
          });
     }

     async create(
          name: string,
     ): Promise<Role> {
          const group = await this.roleRepository.create({
               name,
          });
          return this.roleRepository.save(group);
     }

     async delete(id: number): Promise<void> {
          await this.roleRepository.delete(id);
     }
}
