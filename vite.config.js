import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
    plugins: [
        VitePWA({ 
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
              },
              manifest: {
                name: 'Laravel WebRTC',
                short_name: 'WebRTC',
                description: 'Simple WebRTC application built with Laravel and Vue.js',
                theme_color: '#ffffff',
                icons: [
                  {
                    src: 'icon.svg',
                    sizes: '192x192',
                    type: 'image/svg+xml'
                  },
                  {
                    src: 'icon.svg',
                    sizes: '512x512',
                    type: 'image/svg+xml'
                  }
                ]
              },
            injectRegister: 'auto',
            devOptions: {
                enabled: true
              }
         }),
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
