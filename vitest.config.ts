import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import 'dotenv/config'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        setupFiles: ['./tests/setup.ts'],
        isolate: true,
        fileParallelism: false
    },
})