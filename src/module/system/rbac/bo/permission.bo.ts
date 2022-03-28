import { FindPermissionResDto } from '../dto/permission.dto';
import { PermissionGroupEntity } from '../repository/permission-gruop.entity';
import { PermissionEntity } from '../repository/permission.entity';
import { PgPEntity } from '../repository/pg-p.entity';

export class PermissionGroupBo extends PermissionGroupEntity {}
export class PermissionBo extends PermissionEntity {}
export class PgPBo extends PgPEntity {}
export class FindPermissionResBo extends FindPermissionResDto {}
