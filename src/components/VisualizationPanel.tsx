import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculationResult, HierarchyConfiguration, AreaItem } from '@/types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Position,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface VisualizationPanelProps {
  results: CalculationResult[];
  hierarchy: HierarchyConfiguration;
  commonAreas: AreaItem[];
  internalUnits: AreaItem[];
}

// Custom node types
const nodeTypes: NodeTypes = {
  commonArea: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md bg-blue-100 border-2 border-blue-300 rounded-md min-w-[150px]">
      <div className="font-bold text-blue-800">{data.label}</div>
      <div className="text-xs text-blue-600">{data.area.toFixed(2)} m²</div>
    </div>
  ),
  internalUnit: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md bg-green-100 border-2 border-green-300 rounded-md min-w-[150px]">
      <div className="font-bold text-green-800">{data.label}</div>
      <div className="text-xs text-green-600">{data.area.toFixed(2)} m²</div>
    </div>
  ),
  level: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md bg-amber-100 border-2 border-amber-300 rounded-md min-w-[150px]">
      <div className="font-bold text-amber-800">{data.label}</div>
      <div className="text-xs text-amber-600">{data.description}</div>
    </div>
  ),
};

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ 
  results, 
  hierarchy, 
  commonAreas, 
  internalUnits 
}) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;
    let yOffset = 0;

    // Add common areas at the top
    commonAreas.forEach((area, index) => {
      nodes.push({
        id: `common-${area.id}`,
        type: 'commonArea',
        position: { x: (index % 3) * 250, y: yOffset },
        data: {
          label: area.id,
          area: area.originalArea,
          type: 'common'
        },
      });
    });

    yOffset += 150;

    // Add hierarchy levels in the middle
    hierarchy.levels.forEach((level, levelIndex) => {
      nodes.push({
        id: `level-${level.id}`,
        type: 'level',
        position: { x: 400, y: yOffset },
        data: {
          label: level.name,
          description: `${level.plans.length} 个分摊计划`,
        },
      });

      // Connect common areas to levels
      level.plans.forEach((plan, planIndex) => {
        plan.areasToBeApportioned.forEach(areaId => {
          edges.push({
            id: `edge-${level.id}-${plan.id}-${areaId}`,
            source: `common-${areaId}`,
            target: `level-${level.id}`,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            label: `计划 ${planIndex + 1}`,
            labelStyle: { fontSize: 10 },
          });
        });
      });

      yOffset += 150;
    });

    // Add internal units at the bottom
    internalUnits.forEach((unit, index) => {
      nodes.push({
        id: `unit-${unit.id}`,
        type: 'internalUnit',
        position: { x: (index % 3) * 250, y: yOffset },
        data: {
          label: unit.id,
          area: unit.originalArea,
          type: 'internal'
        },
      });

      // Connect levels to internal units
      hierarchy.levels.forEach(level => {
        level.plans.forEach(plan => {
          if (plan.participatingObjects.includes(unit.id)) {
            edges.push({
              id: `edge-${level.id}-${plan.id}-${unit.id}`,
              source: `level-${level.id}`,
              target: `unit-${unit.id}`,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              label: plan.name,
              labelStyle: { fontSize: 10 },
            });
          }
        });
      });
    });

    return { nodes, edges };
  }, [commonAreas, internalUnits, hierarchy]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const resetViewport = () => {
    // This would be handled by the ReactFlow component's fitView prop
    // For simplicity, we'll just reload the page
    window.location.reload();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">分摊路径图</h3>
          <p className="text-sm text-gray-600">可视化展示面积分摊的路径和关系</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={resetViewport}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置视图
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <div className="h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Controls
                showZoom={true}
                showFitView={false}
                showInteractive={false}
              />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-300 border-2 border-blue-500 rounded"></div>
              <span className="text-sm">共有面积</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-300 border-2 border-amber-500 rounded"></div>
              <span className="text-sm">分摊层级</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
              <span className="text-sm">套内单元</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisualizationPanel;