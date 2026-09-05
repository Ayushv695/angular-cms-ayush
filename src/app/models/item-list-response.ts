import { Item } from './item';

export interface ItemListResponse {
  data: Item[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
  };
  success: boolean;
  message: string;
}
