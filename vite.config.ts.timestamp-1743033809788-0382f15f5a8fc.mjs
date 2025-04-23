// vite.config.ts
import { defineConfig } from "file:///C:/Users/Maud/Downloads/b1/project/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Maud/Downloads/b1/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { splitVendorChunkPlugin } from "file:///C:/Users/Maud/Downloads/b1/project/node_modules/vite/dist/node/index.js";
import compression from "file:///C:/Users/Maud/Downloads/b1/project/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///C:/Users/Maud/Downloads/b1/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const plugins = [
    react(),
    splitVendorChunkPlugin(),
    compression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br"
    })
  ];
  if (mode === "analyze") {
    plugins.push(
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true
      })
    );
  }
  return {
    plugins,
    server: {
      port: 5173,
      host: true
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020"
      }
    },
    build: {
      target: "es2020",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["lucide-react"],
            "i18n-vendor": ["i18next", "react-i18next"]
          }
        }
      },
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNYXVkXFxcXERvd25sb2Fkc1xcXFxiMVxcXFxwcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNYXVkXFxcXERvd25sb2Fkc1xcXFxiMVxcXFxwcm9qZWN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9NYXVkL0Rvd25sb2Fkcy9iMS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4gfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgcGx1Z2lucyA9IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksXHJcbiAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICBleHQ6ICcuZ3onLFxyXG4gICAgfSksXHJcbiAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcclxuICAgICAgZXh0OiAnLmJyJyxcclxuICAgIH0pLFxyXG4gIF07XHJcblxyXG4gIC8vIEFkZCB2aXN1YWxpemVyIHBsdWdpbiBpbiBhbmFseXplIG1vZGVcclxuICBpZiAobW9kZSA9PT0gJ2FuYWx5emUnKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxyXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxyXG4gICAgICAgIGJyb3RsaVNpemU6IHRydWUsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnMsXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogNTE3MyxcclxuICAgICAgaG9zdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICAgIHRhcmdldDogJ2VzMjAyMCdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXHJcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAgICd1aS12ZW5kb3InOiBbJ2x1Y2lkZS1yZWFjdCddLFxyXG4gICAgICAgICAgICAnaTE4bi12ZW5kb3InOiBbJ2kxOG5leHQnLCAncmVhY3QtaTE4bmV4dCddLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXHJcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFTLG9CQUFvQjtBQUNqVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyw4QkFBOEI7QUFDdkMsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxrQkFBa0I7QUFFM0IsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxVQUFVO0FBQUEsSUFDZCxNQUFNO0FBQUEsSUFDTix1QkFBdUI7QUFBQSxJQUN2QixZQUFZO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxZQUFZO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUdBLE1BQUksU0FBUyxXQUFXO0FBQ3RCLFlBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNULE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osZ0JBQWdCO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLGNBQWM7QUFBQSxNQUNkLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQSxZQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUN6RCxhQUFhLENBQUMsY0FBYztBQUFBLFlBQzVCLGVBQWUsQ0FBQyxXQUFXLGVBQWU7QUFBQSxVQUM1QztBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
