// Mock Electron API
Object.defineProperty(window, 'require', {
  value: jest.fn(),
});

// Mock File API
Object.defineProperty(global, 'File', {
  value: class File {
    name: string;
    size: number;
    type: string;
    
    constructor(chunks: any[], filename: string, options: any = {}) {
      this.name = filename;
      this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      this.type = options.type || '';
    }
  },
});

// Mock URL.createObjectURL
Object.defineProperty(global.URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
});

// Mock URL.revokeObjectURL
Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: jest.fn(),
});

// Mock Blob
Object.defineProperty(global, 'Blob', {
  value: class Blob {
    constructor(parts: any[], options: any = {}) {
      this.size = parts.reduce((acc, part) => acc + part.length, 0);
    }
  },
});

// Mock XLSX library
jest.mock('xlsx', () => ({
  read: jest.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {
        '!ref': 'A1:B2',
        A1: { v: '户号' },
        B1: { v: '套内面积' },
        A2: { v: '101' },
        B2: { v: 85.5 },
      },
    },
  })),
  utils: {
    sheet_to_json: jest.fn(() => [
      { '户号': '101', '套内面积': 85.5 },
      { '户号': '102', '套内面积': 92.3 },
    ]),
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
    write: jest.fn(() => new ArrayBuffer(8)),
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock @dnd-kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => children,
  useSensor: jest.fn(),
  useSensors: jest.fn(),
  closestCenter: jest.fn(),
  DragEndEvent: {},
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => children,
  arrayMove: jest.fn((array, fromIndex, toIndex) => {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }),
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: jest.fn(),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => 'transform'),
    },
  },
}));

// Mock React Flow
jest.mock('reactflow', () => ({
  ReactFlow: ({ children }: any) => children,
  Controls: () => null,
  Background: () => null,
  useNodesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
  useEdgesState: jest.fn(() => [[], jest.fn(), jest.fn()]),
  addEdge: jest.fn(),
  MarkerType: {
    ArrowClosed: 'arrowclosed',
  },
}));

// Set up jsdom environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});