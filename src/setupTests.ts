/**
 * Setup file for Jest tests
 * 
 * This file is run before each test file.
 */

import '@testing-library/jest-dom';

// Mock the i18next library
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'fr',
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock the Lucide React icons
jest.mock('lucide-react', () => {
  const icons: Record<string, any> = {};
  const handler = {
    get: function(target: any, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      
      // Create a mock component for the requested icon
      const IconComponent = () => 'Icon';
      icons[prop] = IconComponent;
      return IconComponent;
    }
  };
  
  return new Proxy(icons, handler);
});

// Mock the API service
jest.mock('./services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
    isAuthenticated: jest.fn(),
    getUserInfo: jest.fn(),
    hasRole: jest.fn(),
  },
}));

// Create a global fetch mock
global.fetch = jest.fn();

// Create a global localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});