import React from 'react';
import { useAppStore } from '@/lib/store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ApportionmentLevel } from '@/types';
import { toast } from 'react-hot-toast';

const HierarchyLevelList: React.FC = () => {
  const { 
    hierarchy, 
    selectedLevelId, 
    setSelectedLevelId, 
    updateLevelOrder, 
    deleteLevel 
  } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = hierarchy.levels.findIndex((level) => level.id === active.id);
      const newIndex = hierarchy.levels.findIndex((level) => level.id === over.id);
      
      const reorderedLevels = arrayMove(hierarchy.levels, oldIndex, newIndex);
      
      // Update order property for each level
      const updatedLevels = reorderedLevels.map((level, index) => ({
        ...level,
        order: index
      }));
      
      updateLevelOrder(updatedLevels);
      toast.success('层级顺序已更新');
    }
  };

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
  };

  const handleDeleteLevel = (levelId: string) => {
    deleteLevel(levelId);
    if (selectedLevelId === levelId) {
      setSelectedLevelId(null);
    }
    toast.success('层级已删除');
  };

  return (
    <div className="space-y-2">
      {hierarchy.levels.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          暂无分摊层级，请点击"添加层级"按钮创建
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={hierarchy.levels.map(level => level.id)}
            strategy={verticalListSortingStrategy}
          >
            {hierarchy.levels.map((level) => (
              <SortableItem
                key={level.id}
                id={level.id}
                level={level}
                isSelected={selectedLevelId === level.id}
                onSelect={handleSelectLevel}
                onDelete={handleDeleteLevel}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default HierarchyLevelList;