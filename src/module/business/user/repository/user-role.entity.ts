import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_role', synchronize: false })
@Index(['uid', 'rid'], { unique: true })
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '用户ID' })
  uid: number;

  @Column({ type: 'int', nullable: true, comment: '角色id' })
  rid: number;
}
