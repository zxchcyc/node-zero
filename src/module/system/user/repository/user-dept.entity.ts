import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_dept', synchronize: true })
@Index(['did'])
@Index(['uid', 'did'], { unique: true })
export class UserDeptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '经销商id' })
  uid: number;

  @Column({ type: 'int', nullable: true, comment: '部门id' })
  did: number;
}
