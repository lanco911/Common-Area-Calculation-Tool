import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { AreaItem } from '@/types';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AreaListProps {
  type: 'common' | 'internal';
  items: AreaItem[];
}

const AreaList: React.FC<AreaListProps> = ({ type, items }) => {
  const { deleteCommonArea, deleteInternalUnit } = useAppStore();

  const handleDelete = (id: string) => {
    if (type === 'common') {
      deleteCommonArea(id);
      toast.success('共有面积已删除');
    } else {
      deleteInternalUnit(id);
      toast.success('套内单元已删除');
    }
  };

  const getTitle = () => {
    return type === 'common' ? '共有面积' : '套内单元';
  };

  const getIdLabel = () => {
    return type === 'common' ? '项目名称' : '户号';
  };

  return (
    <div className="border rounded-md">
      {items.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          暂无{getTitle()}数据
        </div>
      ) : (
        <div className="max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{getIdLabel()}</TableHead>
                <TableHead>原始面积</TableHead>
                <TableHead>累计面积</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.originalArea.toFixed(2)}</TableCell>
                  <TableCell>{item.cumulativeArea.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AreaList;