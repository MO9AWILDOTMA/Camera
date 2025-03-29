// Define the shape of a generic data item
export interface DataItem {
    id: number | string;
    [key: string]: any;
  }
  
  // Define column type
export interface Column<T> {
    key: keyof T;
    label: string;
  }
  
  // Props interface
export interface TableProps<T extends DataItem> {
    columns?: Column<T>[];
    data?: T[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onShow?: (item: T) => void;
    showActions?: boolean;
  }