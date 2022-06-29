import { mysql } from '../database';
import { AccessKeyModel } from '../models/index';

const getAccessKeyByAccessKeyID = async (access_key_id: string): Promise<AccessKeyModel | null> => {
  const res: AccessKeyModel[] = await mysql.query(mysql.mainDB(), {
    sql: 'SELECT id,app_key,access_key_id,access_key_secret,UNIX_TIMESTAMP(`deleted_at`) as deleted_at,UNIX_TIMESTAMP(`expired_at`) as expired_at FROM access_key WHERE access_key_id = ? AND `deleted_at` IS NULL',
    values: [access_key_id]
  }) as AccessKeyModel[];
  if (res.length > 0) {
    return res[0];
  }
  return null;
};

export default {
  getAccessKeyByAccessKeyID
};
