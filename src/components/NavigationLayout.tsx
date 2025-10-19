import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataInputPanel from './DataInputPanel';
import HierarchyManagementPanel from './HierarchyManagementPanel';
import CalculationResultsPanel from './CalculationResultsPanel';
import VisualizationPanel from './VisualizationPanel';

const NavigationLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('data-input');

  return (
    <div className="flex flex-col h-full">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">房地产公共区域面积分摊工具</h1>
        <p className="text-slate-300 mt-1">Common Area Calculation Tool</p>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 m-4">
            <TabsTrigger value="data-input" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              数据输入
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              分摊层级
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              最终结果
            </TabsTrigger>
            <TabsTrigger value="visualization" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              分摊路径图
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 p-4 overflow-auto">
            <TabsContent value="data-input" className="h-full mt-0">
              <DataInputPanel />
            </TabsContent>
            
            <TabsContent value="hierarchy" className="h-full mt-0">
              <HierarchyManagementPanel />
            </TabsContent>
            
            <TabsContent value="results" className="h-full mt-0">
              <CalculationResultsPanel />
            </TabsContent>
            
            <TabsContent value="visualization" className="h-full mt-0">
              <VisualizationPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationLayout;