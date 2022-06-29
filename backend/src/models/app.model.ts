import { Model } from '../framework';

export interface AccessKeyModel extends Model {
  id: number;
  app_key: string;
  access_key_id: string;
  access_key_secret: string;
  created_at: number;
  expired_at: number;
  deleted_at: number;
}
