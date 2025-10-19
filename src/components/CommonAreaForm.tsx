import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

const CommonAreaForm: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [area, setArea] = useState('');
  const { addCommonArea } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) {
      toast.error('请输入项目名称');
      return;
    }
    
    const areaValue = parseFloat(area);
    if (isNaN(areaValue) || areaValue <= 0) {
      toast.error('请输入有效的面积（大于0的数字）');
      return;
    }
    
    addCommonArea({
      id: itemName,
      type: 'common',
      originalArea: areaValue,
      cumulativeArea: areaValue
    });
    
    toast.success('共有面积已添加');
    
    // Reset form
    setItemName('');
    setArea('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="itemName" className="text-sm font-medium">
          项目名称
        </label>
        <Input
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="例如：大堂、电梯井等"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="area" className="text-sm font-medium">
          面积（平方米）
        </label>
        <Input
          id="area"
          type="number"
          step="0.01"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="请输入面积"
        />
      </div>
      
      <Button type="submit" className="w-full">
        添加
      </Button>
    </form>
  );
};

export default CommonAreaForm;