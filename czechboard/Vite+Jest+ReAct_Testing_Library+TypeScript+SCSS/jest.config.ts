// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  // Указываем, что используем TypeScript через ts-jest
  preset: 'ts-jest',

  // Эмулируем браузерное окружение (DOM)
  testEnvironment: 'jsdom',

  // Файл, который будет выполняться перед каждым тестовым файлом.
  // Сюда мы импортируем матчеры из jest-dom.
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Говорим Jest, как обрабатывать разные типы файлов
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      // Важно: используем отдельный tsconfig для тестов
      tsconfig: 'tsconfig.test.json',
    }],
  },

  // Здесь мы «подменяем» импорты CSS/SCSS, чтобы Jest не пытался их парсить.
  // identity-obj-proxy возвращает строку вместо реального CSS.
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  // Указываем, где искать тесты
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)'],
};

export default config;