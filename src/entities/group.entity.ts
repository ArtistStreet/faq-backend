// entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Faq } from './faq.entity';
import { RoleName } from 'src/common/enums/role.enum';
import { SearchFields } from 'src/common/decorators/entity.decorators';

@ObjectType()
@Entity()
@SearchFields(['name', 'description'])
export class GroupEntity extends BaseEntity {
     @Field(() => Int)
     @PrimaryGeneratedColumn()
     id: number;

     @Field()
     @Column()
     name: string;

     @Field({ nullable: true })
     @Column({ nullable: true })
     description?: string;

     @Field(() => Int, { nullable: true })
     @Column({ nullable: true })
     parent_id?: number;

     @Field(() => GroupEntity, { nullable: true })
     @ManyToOne(() => GroupEntity, (g) => g.children, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'parent_id' })
     parent?: GroupEntity;

     @Field(() => [GroupEntity], { nullable: true })
     @OneToMany(() => GroupEntity, (g) => g.parent)
     children?: GroupEntity[];

     @Field(() => Boolean, { nullable: true })
     hasChildren?: boolean; // field ảo, không lưu DB

     // QUAN HỆ NHIỀU-NHIỀU VỚI ROLE – ĐÚNG CÁCH
     // @Field(() => [Role])
     // @ManyToMany(() => Role, (role) => role.groups, {
     //      // onDelete: 'CASCADE',
     // })
     // @JoinTable({
     //      name: 'group_role', // tên bảng trung gian
     //      joinColumn: { name: 'group_id', referencedColumnName: 'id' },
     //      inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
     // })
     // roles: Role[];

     @Column({ type: 'smallint' })
     @Field(() => Int)
     role: RoleName;

     @Field(() => [Faq], { nullable: true })
     @OneToMany(() => Faq, (faq) => faq.group, {
          nullable: true,
          onDelete: 'SET NULL', // nếu xóa group thì faq.group = null
          cascade: true,        // tùy chọn: tự save faq khi save group
     })
     faqs?: Faq[];
}