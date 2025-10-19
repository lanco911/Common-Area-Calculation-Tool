import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { ApportionmentLevel, ApportionmentPlan } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LevelConfiguration: React.FC = () => {
  const {
    selectedLevelId,
    hierarchy,
    commonAreas,
    internalUnits,
    updateLevel,
    addPlanToLevel,
    deletePlanFromLevel,
    updatePlan
  } = useAppStore();

  const selectedLevel = hierarchy.levels.find(level => level.id === selectedLevelId);

  const [newPlanName, setNewPlanName] = useState('');

  if (!selectedLevel) {
    return (
      <div className="p-8 text-center text-gray-500">
        请从左侧选择一个层级进行配置
      </div>
    );
  }

  const handleLevelNameChange = (name: string) => {
    updateLevel(selectedLevelId, { name });
  };

  const handleAddPlan = () => {
    if (!newPlanName.trim()) {
      toast.error('请输入分摊计划名称');
      return;
    }

    addPlanToLevel(selectedLevelId, {
      name: newPlanName,
      areasToBeApportioned: [],
      participatingObjects: []
    });

    setNewPlanName('');
    toast.success('分摊计划已添加');
  };

  const handleDeletePlan = (planId: string) => {
    deletePlanFromLevel(selectedLevelId, planId);
    toast.success('分摊计划已删除');
  };

  const handlePlanCheckboxChange = (
    planId: string,
    field: 'areasToBeApportioned' | 'participatingObjects',
    itemId: string,
    checked: boolean
  ) => {
    const plan = selectedLevel.plans.find(p => p.id === planId);
    if (!plan) return;

    const currentItems = plan[field];
    let updatedItems: string[];

    if (checked) {
      updatedItems = [...currentItems, itemId];
    } else {
      updatedItems = currentItems.filter(id => id !== itemId);
    }

    updatePlan(selectedLevelId, planId, {
      [field]: updatedItems
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="levelName" className="text-sm font-medium">
          层级名称
        </label>
        <Input
          id="levelName"
          value={selectedLevel.name}
          onChange={(e) => handleLevelNameChange(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="分摊计划名称"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlan()}
          />
          <Button onClick={handleAddPlan}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {selectedLevel.plans.length === 0 ? (
          <div className="p-4 text-center text-gray-500 border rounded-md">
            暂无分摊计划，请添加
          </div>
        ) : (
          <div className="space-y-4">
            {selectedLevel.plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">要分摊的共有面积</h4>
                    <div className="space-y-2 max-h-32 overflow-auto border rounded-md p-2">
                      {commonAreas.length === 0 ? (
                        <div className="text-sm text-gray-500">暂无共有面积数据</div>
                      ) : (
                        commonAreas.map((area) => (
                          <div key={area.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${plan.id}-common-${area.id}`}
                              checked={plan.areasToBeApportioned.includes(area.id)}
                              onCheckedChange={(checked) =>
                                handlePlanCheckboxChange(
                                  plan.id,
                                  'areasToBeApportioned',
                                  area.id,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={`${plan.id}-common-${area.id}`}
                              className="text-sm"
                            >
                              {area.id} ({area.originalArea.toFixed(2)} m²)
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">参与分摊的对象</h4>
                    <div className="space-y-2 max-h-32 overflow-auto border rounded-md p-2">
                      {commonAreas.length === 0 && internalUnits.length === 0 ? (
                        <div className="text-sm text-gray-500">暂无数据</div>
                      ) : (
                        <>
                          {commonAreas.length > 0 && (
                            <div className="mb-2">
                              <h5 className="text-sm font-medium text-gray-600 mb-1">共有面积</h5>
                              {commonAreas.map((area) => (
                                <div key={area.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${plan.id}-participating-common-${area.id}`}
                                    checked={plan.participatingObjects.includes(area.id)}
                                    onCheckedChange={(checked) =>
                                      handlePlanCheckboxChange(
                                        plan.id,
                                        'participatingObjects',
                                        area.id,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${plan.id}-participating-common-${area.id}`}
                                    className="text-sm"
                                  >
                                    {area.id} ({area.originalArea.toFixed(2)} m²)
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          {internalUnits.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-600 mb-1">套内单元</h5>
                              {internalUnits.map((unit) => (
                                <div key={unit.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${plan.id}-participating-unit-${unit.id}`}
                                    checked={plan.participatingObjects.includes(unit.id)}
                                    onCheckedChange={(checked) =>
                                      handlePlanCheckboxChange(
                                        plan.id,
                                        'participatingObjects',
                                        unit.id,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${plan.id}-participating-unit-${unit.id}`}
                                    className="text-sm"
                                  >
                                    {unit.id} ({unit.originalArea.toFixed(2)} m²)
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelConfiguration;