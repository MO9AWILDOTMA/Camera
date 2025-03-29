import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle, Eye, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Column, DataItem, TableProps } from "@/types/table-types";

function GenericTable<T extends DataItem>({
  columns = [] as Column<T>[],
  data = [] as T[],
  onEdit = () => {},
  onDelete = () => {},
  onShow = () => {},
  showActions = true,
}: TableProps<T>) {
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<T | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteConfirmItem) {
      onDelete(deleteConfirmItem);
      setDeleteConfirmItem(null);
    }
  };

  // Mobile View Component
  const MobileItemView = ({ item }: { item: any }) => {
    return (
      <div className="border-b p-4 md:hidden bg-white">
        <div className="flex justify-between items-center mb-2">
          {/* Primary identifier (first column) */}
          <span className="font-medium">{item[columns[0].key]}</span>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShow(item)}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeleteConfirmItem(item)}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Dynamic column rendering for mobile */}
        <div className="space-y-1">
          {columns.slice(1).map((column) => (
            <div
              key={String(column.key)}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">{column.label}</span>
              <span>
                {Array.isArray(item[column.key])
                  ? item[column.key].join(", ")
                  : item[column.key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead className="text-center" key={String(column.key)}>
                  {column.label}
                </TableHead>
              ))}
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell className="text-center" key={String(column.key)}>
                    {Array.isArray(item[column.key])
                      ? item[column.key].join(", ")
                      : item[column.key]}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onShow(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmItem(item)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden">
        {data.map((item) => (
          <MobileItemView key={item.id} item={item} />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmItem}
        onOpenChange={() => setDeleteConfirmItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 text-red-500 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the item{" "}
              {deleteConfirmItem && (deleteConfirmItem as any).name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmItem(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GenericTable;
