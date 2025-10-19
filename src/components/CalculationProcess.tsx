import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalculationResult, HierarchyConfiguration, AreaItem } from '@/types';

interface CalculationProcessProps {
  results: CalculationResult[];
  hierarchy: HierarchyConfiguration;
  commonAreas: AreaItem[];
  internalUnits: AreaItem[];
}

const CalculationProcess: React.FC<CalculationProcessProps> = ({ 
  results, 
  hierarchy, 
  commonAreas, 
  internalUnits 
}) => {
  // Get all area items for easy lookup
  const allAreas = [...commonAreas, ...internalUnits];
  const getAreaById = (id: string) => allAreas.find(area => area.id === id);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>分摊计算过程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hierarchy.levels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无分摊层级数据
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {hierarchy.levels.map((level, levelIndex) => (
                  <AccordionItem key={level.id} value={`level-${level.id}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">
                          {levelIndex + 1}. {level.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {level.plans.length} 个分摊计划
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {level.plans.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            此层级暂无分摊计划
                          </div>
                        ) : (
                          level.plans.map((plan, planIndex) => (
                            <Card key={plan.id}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                  计划 {planIndex + 1}: {plan.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">要分摊的共有面积</h4>
                                  {plan.areasToBeApportioned.length === 0 ? (
                                    <div className="text-sm text-gray-500">无</div>
                                  ) : (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>项目名称</TableHead>
                                          <TableHead>面积</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {plan.areasToBeApportioned.map(areaId => {
                                          const area = getAreaById(areaId);
                                          return area ? (
                                            <TableRow key={areaId}>
                                              <TableCell>{area.id}</TableCell>
                                              <TableCell>{area.originalArea.toFixed(2)} m²</TableCell>
                                            </TableRow>
                                          ) : null;
                                        })}
                                      </TableBody>
                                    </Table>
                                  )}
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">参与分摊的对象</h4>
                                  {plan.participatingObjects.length === 0 ? (
                                    <div className="text-sm text-gray-500">无</div>
                                  ) : (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>对象</TableHead>
                                          <TableHead>类型</TableHead>
                                          <TableHead>面积</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {plan.participatingObjects.map(objectId => {
                                          const object = getAreaById(objectId);
                                          return object ? (
                                            <TableRow key={objectId}>
                                              <TableCell>{object.id}</TableCell>
                                              <TableCell>
                                                {object.type === 'common' ? '共有面积' : '套内单元'}
                                              </TableCell>
                                              <TableCell>{object.originalArea.toFixed(2)} m²</TableCell>
                                            </TableRow>
                                          ) : null;
                                        })}
                                      </TableBody>
                                    </Table>
                                  )}
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">分摊计算</h4>
                                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                    {(() => {
                                      const totalApportionedArea = plan.areasToBeApportioned.reduce(
                                        (sum, areaId) => {
                                          const area = getAreaById(areaId);
                                          return sum + (area ? area.originalArea : 0);
                                        }, 0
                                      );

                                      const totalParticipatingArea = plan.participatingObjects.reduce(
                                        (sum, objectId) => {
                                          const object = getAreaById(objectId);
                                          return sum + (object ? object.originalArea : 0);
                                        }, 0
                                      );

                                      return (
                                        <div>
                                          <p>总待分摊面积: {totalApportionedArea.toFixed(2)} m²</p>
                                          <p>总参与分摊面积: {totalParticipatingArea.toFixed(2)} m²</p>
                                          <p>
                                            分摊系数: {totalParticipatingArea > 0 
                                              ? (totalApportionedArea / totalParticipatingArea).toFixed(6) 
                                              : '0'}
                                          </p>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculationProcess;