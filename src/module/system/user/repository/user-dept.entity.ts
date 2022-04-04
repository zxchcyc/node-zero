import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_dept', synchronize: false })
@Index(['did'])
@Index(['uid', 'did'], { unique: true })
export class UserDeptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '用户id' })
  uid: number;

  @Column({ type: 'int', nullable: true, comment: '部门id' })
  did: number;
}
