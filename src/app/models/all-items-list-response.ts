import { Item } from './item';

export interface AllItemsListResponse {
  data: Item[];
  success: boolean;
  message: string;
}
