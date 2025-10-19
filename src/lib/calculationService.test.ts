import { describe, it, expect } from 'vitest';
import { 
  calculateApportionment, 
  validateHierarchy, 
  calculateLevelApportionment 
} from './calculationService';
import { AreaItem, HierarchyConfiguration, ApportionmentLevel } from '@/types';

describe('calculationService', () => {
  const mockCommonAreas: AreaItem[] = [
    { id: '大堂', type: 'common', originalArea: 100, cumulativeArea: 100 },
    { id: '电梯井', type: 'common', originalArea: 50, cumulativeArea: 50 },
  ];

  const mockInternalUnits: AreaItem[] = [
    { id: '101', type: 'internal', originalArea: 85.5, cumulativeArea: 85.5 },
    { id: '102', type: 'internal', originalArea: 92.3, cumulativeArea: 92.3 },
  ];

  const mockHierarchy: HierarchyConfiguration = {
    levels: [
      {
        id: 'level1',
        name: '第一级分摊',
        order: 0,
        plans: [
          {
            id: 'plan1',
            name: '大堂分摊',
            areasToBeApportioned: ['大堂'],
            participatingObjects: ['101', '102'],
          },
        ],
      },
    ],
  };

  describe('validateHierarchy', () => {
    it('should return valid for a correct hierarchy', () => {
      const result = validateHierarchy(mockHierarchy);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid for empty hierarchy', () => {
      const result = validateHierarchy({ levels: [] });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('分摊层级不能为空');
    });

    it('should return invalid for level with empty plans', () => {
      const invalidHierarchy: HierarchyConfiguration = {
        levels: [
          {
            id: 'level1',
            name: '第一级分摊',
            order: 0,
            plans: [],
          },
        ],
      };
      
      const result = validateHierarchy(invalidHierarchy);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('每个层级必须至少有一个分摊计划');
    });

    it('should return invalid for plan with empty areas to be apportioned', () => {
      const invalidHierarchy: HierarchyConfiguration = {
        levels: [
          {
            id: 'level1',
            name: '第一级分摊',
            order: 0,
            plans: [
              {
                id: 'plan1',
                name: '大堂分摊',
                areasToBeApportioned: [],
                participatingObjects: ['101', '102'],
              },
            ],
          },
        ],
      };
      
      const result = validateHierarchy(invalidHierarchy);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('每个分摊计划必须指定要分摊的共有面积');
    });

    it('should return invalid for plan with empty participating objects', () => {
      const invalidHierarchy: HierarchyConfiguration = {
        levels: [
          {
            id: 'level1',
            name: '第一级分摊',
            order: 0,
            plans: [
              {
                id: 'plan1',
                name: '大堂分摊',
                areasToBeApportioned: ['大堂'],
                participatingObjects: [],
              },
            ],
          },
        ],
      };
      
      const result = validateHierarchy(invalidHierarchy);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('每个分摊计划必须指定参与分摊的对象');
    });
  });

  describe('calculateLevelApportionment', () => {
    it('should calculate apportionment correctly', () => {
      const level: ApportionmentLevel = {
        id: 'level1',
        name: '第一级分摊',
        order: 0,
        plans: [
          {
            id: 'plan1',
            name: '大堂分摊',
            areasToBeApportioned: ['大堂'],
            participatingObjects: ['101', '102'],
          },
        ],
      };
      
      const allAreas = [...mockCommonAreas, ...mockInternalUnits];
      const result = calculateLevelApportionment(level, allAreas);
      
      // Check that the calculation is correct
      // Total area to be apportioned: 100 (大堂)
      // Total participating area: 85.5 + 92.3 = 177.8
      // Apportionment ratio: 100 / 177.8 = 0.562429
      // 101 should get: 85.5 * 0.562429 = 48.09
      // 102 should get: 92.3 * 0.562429 = 51.91
      
      expect(result['101']).toBeCloseTo(48.09, 1);
      expect(result['102']).toBeCloseTo(51.91, 1);
    });

    it('should handle multiple plans in a level', () => {
      const level: ApportionmentLevel = {
        id: 'level1',
        name: '第一级分摊',
        order: 0,
        plans: [
          {
            id: 'plan1',
            name: '大堂分摊',
            areasToBeApportioned: ['大堂'],
            participatingObjects: ['101', '102'],
          },
          {
            id: 'plan2',
            name: '电梯井分摊',
            areasToBeApportioned: ['电梯井'],
            participatingObjects: ['101'],
          },
        ],
      };
      
      const allAreas = [...mockCommonAreas, ...mockInternalUnits];
      const result = calculateLevelApportionment(level, allAreas);
      
      // 101 should get apportionment from both plans
      // From plan1: 85.5 * (100 / 177.8) = 48.09
      // From plan2: 85.5 * (50 / 85.5) = 50
      // Total: 48.09 + 50 = 98.09
      
      // 102 should only get apportionment from plan1
      // From plan1: 92.3 * (100 / 177.8) = 51.91
      
      expect(result['101']).toBeCloseTo(98.09, 1);
      expect(result['102']).toBeCloseTo(51.91, 1);
    });
  });

  describe('calculateApportionment', () => {
    it('should calculate final results correctly', () => {
      const result = calculateApportionment(mockCommonAreas, mockInternalUnits, mockHierarchy);
      
      expect(result).toHaveLength(2);
      
      const unit101 = result.find(r => r.unitId === '101');
      const unit102 = result.find(r => r.unitId === '102');
      
      expect(unit101).toBeDefined();
      expect(unit102).toBeDefined();
      
      // Check original areas
      expect(unit101?.originalArea).toBe(85.5);
      expect(unit102?.originalArea).toBe(92.3);
      
      // Check apportioned areas (from previous test)
      expect(unit101?.apportionedArea).toBeCloseTo(48.09, 1);
      expect(unit102?.apportionedArea).toBeCloseTo(51.91, 1);
      
      // Check final areas
      expect(unit101?.finalArea).toBeCloseTo(133.59, 1);
      expect(unit102?.finalArea).toBeCloseTo(144.21, 1);
    });

    it('should handle multiple levels correctly', () => {
      const multiLevelHierarchy: HierarchyConfiguration = {
        levels: [
          {
            id: 'level1',
            name: '第一级分摊',
            order: 0,
            plans: [
              {
                id: 'plan1',
                name: '大堂分摊',
                areasToBeApportioned: ['大堂'],
                participatingObjects: ['101', '102'],
              },
            ],
          },
          {
            id: 'level2',
            name: '第二级分摊',
            order: 1,
            plans: [
              {
                id: 'plan2',
                name: '电梯井分摊',
                areasToBeApportioned: ['电梯井'],
                participatingObjects: ['101', '102'],
              },
            ],
          },
        ],
      };
      
      const result = calculateApportionment(mockCommonAreas, mockInternalUnits, multiLevelHierarchy);
      
      const unit101 = result.find(r => r.unitId === '101');
      const unit102 = result.find(r => r.unitId === '102');
      
      // Both units should get apportionment from both levels
      expect(unit101?.apportionedArea).toBeGreaterThan(0);
      expect(unit102?.apportionedArea).toBeGreaterThan(0);
      
      // Final areas should be original + apportioned
      expect(unit101?.finalArea).toBeCloseTo(unit101!.originalArea + unit101!.apportionedArea, 2);
      expect(unit102?.finalArea).toBeCloseTo(unit102!.originalArea + unit102!.apportionedArea, 2);
    });
  });
});