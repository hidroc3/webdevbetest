export interface PaginationInterface<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
