import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { AreaItem, ApportionmentLevel, HierarchyConfiguration, CalculationResult } from '../types';

interface AppStore {
  // State
  commonAreas: AreaItem[];
  internalUnits: AreaItem[];
  hierarchy: HierarchyConfiguration;
  calculationResults: CalculationResult[];
  isCalculating: boolean;
  calculationError: string | null;

  // Actions for Common Areas
  addCommonArea: (area: Omit<AreaItem, 'id'>) => void;
  updateCommonArea: (id: string, area: Partial<AreaItem>) => void;
  deleteCommonArea: (id: string) => void;
  importCommonAreas: (areas: Omit<AreaItem, 'id'>[]) => void;

  // Actions for Internal Units
  addInternalUnit: (unit: Omit<AreaItem, 'id'>) => void;
  updateInternalUnit: (id: string, unit: Partial<AreaItem>) => void;
  deleteInternalUnit: (id: string) => void;
  importInternalUnits: (units: Omit<AreaItem, 'id'>[]) => void;

  // Actions for Hierarchy
  addLevel: (level: Omit<ApportionmentLevel, 'id'>) => void;
  updateLevel: (id: string, level: Partial<ApportionmentLevel>) => void;
  deleteLevel: (id: string) => void;
  reorderLevels: (fromIndex: number, toIndex: number) => void;

  // Actions for Calculation
  setCalculationResults: (results: CalculationResult[]) => void;
  setCalculating: (isCalculating: boolean) => void;
  setCalculationError: (error: string | null) => void;

  // Reset
  resetAll: () => void;
}

const initialState = {
  commonAreas: [],
  internalUnits: [],
  hierarchy: { levels: [] },
  calculationResults: [],
  isCalculating: false,
  calculationError: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Common Areas Actions
      addCommonArea: (area) => set((state) => ({
        commonAreas: [...state.commonAreas, { ...area, id: generateId() }]
      })),

      updateCommonArea: (id, area) => set((state) => ({
        commonAreas: state.commonAreas.map(item => 
          item.id === id ? { ...item, ...area } : item
        )
      })),

      deleteCommonArea: (id) => set((state) => ({
        commonAreas: state.commonAreas.filter(item => item.id !== id)
      })),

      importCommonAreas: (areas) => set((state) => ({
        commonAreas: [...state.commonAreas, ...areas.map(area => ({ ...area, id: generateId() }))]
      })),

      // Internal Units Actions
      addInternalUnit: (unit) => set((state) => ({
        internalUnits: [...state.internalUnits, { ...unit, id: generateId() }]
      })),

      updateInternalUnit: (id, unit) => set((state) => ({
        internalUnits: state.internalUnits.map(item => 
          item.id === id ? { ...item, ...unit } : item
        )
      })),

      deleteInternalUnit: (id) => set((state) => ({
        internalUnits: state.internalUnits.filter(item => item.id !== id)
      })),

      importInternalUnits: (units) => set((state) => ({
        internalUnits: [...state.internalUnits, ...units.map(unit => ({ ...unit, id: generateId() }))]
      })),

      // Hierarchy Actions
      addLevel: (level) => set((state) => {
        const newLevel = { ...level, id: generateId() };
        return {
          hierarchy: {
            levels: [...state.hierarchy.levels, newLevel]
          }
        };
      }),

      updateLevel: (id, level) => set((state) => ({
        hierarchy: {
          levels: state.hierarchy.levels.map(item => 
            item.id === id ? { ...item, ...level } : item
          )
        }
      })),

      deleteLevel: (id) => set((state) => ({
        hierarchy: {
          levels: state.hierarchy.levels.filter(item => item.id !== id)
        }
      })),

      reorderLevels: (fromIndex, toIndex) => set((state) => {
        const { levels } = state.hierarchy;
        const newLevels = [...levels];
        const [movedLevel] = newLevels.splice(fromIndex, 1);
        newLevels.splice(toIndex, 0, movedLevel);
        
        // Update order property for each level
        const reorderedLevels = newLevels.map((level, index) => ({
          ...level,
          order: index
        }));
        
        return {
          hierarchy: {
            levels: reorderedLevels
          }
        };
      }),

      // Calculation Actions
      setCalculationResults: (results) => set({ calculationResults: results }),
      setCalculating: (isCalculating) => set({ isCalculating }),
      setCalculationError: (error) => set({ calculationError: error }),

      // Reset
      resetAll: () => set(initialState)
    })),
    { name: 'app-store' }
  )
);

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}