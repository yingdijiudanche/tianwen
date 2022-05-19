import { defineConfig } from 'vite'
import path from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import windiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), windiCSS(), macrosPlugin()],
  base: '/manage',
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/styles/wieldy.less')}";`,
        },
        // additionalData: `@import "${path.resolve(__dirname, "src/style/wieldy.module.less")}";`,
        javascriptEnabled: true,
      }
    },
  },
  build: {
    commonjsOptions: {
      esmExternals: true,
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
        },
      },
    },
  },
})
