import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import HierarchyLevelList from './HierarchyLevelList';
import LevelConfiguration from './LevelConfiguration';
import { Plus, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { calculateApportionment, validateHierarchy } from '@/lib/calculationService';

const HierarchyManagementPanel: React.FC = () => {
  const { 
    commonAreas, 
    internalUnits, 
    hierarchy, 
    addLevel, 
    setCalculationResults,
    setCalculating,
    setCalculationError,
    calculationResults 
  } = useAppStore();

  const handleAddLevel = () => {
    const levelCount = hierarchy.levels.length;
    addLevel({
      name: `层级 ${levelCount + 1}`,
      order: levelCount,
      plans: []
    });
    toast.success('已添加新层级');
  };

  const handleCalculate = () => {
    // Validate hierarchy
    const validation = validateHierarchy(hierarchy);
    if (!validation.isValid) {
      toast.error('分摊层级配置有误：' + validation.errors.join('；'));
      setCalculationError(validation.errors.join('；'));
      return;
    }

    // Check if there are common areas and internal units
    if (commonAreas.length === 0) {
      toast.error('请先添加共有面积数据');
      setCalculationError('请先添加共有面积数据');
      return;
    }

    if (internalUnits.length === 0) {
      toast.error('请先添加套内单元数据');
      setCalculationError('请先添加套内单元数据');
      return;
    }

    // Start calculation
    setCalculating(true);
    setCalculationError(null);

    try {
      // Simulate async calculation
      setTimeout(() => {
        const results = calculateApportionment(commonAreas, internalUnits, hierarchy);
        setCalculationResults(results);
        setCalculating(false);
        toast.success('计算完成！');
      }, 1000);
    } catch (error) {
      setCalculating(false);
      setCalculationError('计算过程中发生错误');
      toast.error('计算失败：' + (error as Error).message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分摊层级管理</h2>
          <p className="text-gray-600">创建和配置多级分摊层级，定义分摊顺序和规则</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddLevel}>
            <Plus className="mr-2 h-4 w-4" />
            添加层级
          </Button>
          <Button 
            onClick={handleCalculate} 
            variant="default"
            disabled={hierarchy.levels.length === 0 || commonAreas.length === 0 || internalUnits.length === 0}
          >
            <Play className="mr-2 h-4 w-4" />
            开始计算
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>分摊层级</CardTitle>
            <CardDescription>
              拖拽调整层级顺序，点击层级进行配置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HierarchyLevelList />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>层级配置</CardTitle>
            <CardDescription>
              选择要分摊的共有面积和参与分摊的对象
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LevelConfiguration />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HierarchyManagementPanel;