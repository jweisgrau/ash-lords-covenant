import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // Use node environment for pure logic tests
    include: ['tests/**/*.test.js'],
  },
})
