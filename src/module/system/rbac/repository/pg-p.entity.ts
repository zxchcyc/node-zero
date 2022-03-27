import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pg_p', synchronize: true })
@Index(['pgid', 'pid'], { unique: true })
export class PgPEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, comment: '权限包id' })
  pgid: number;

  @Column({ type: 'int', nullable: false, comment: '权限点id' })
  pid: number;
}
