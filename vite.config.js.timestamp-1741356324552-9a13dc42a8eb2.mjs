// vite.config.js
import { defineConfig } from "file:///C:/xampp/htdocs/loguin-app/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/xampp/htdocs/loguin-app/node_modules/laravel-vite-plugin/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/sass/main.scss",
        "resources/sass/codebase/themes/corporate.scss",
        "resources/sass/codebase/themes/earth.scss",
        "resources/sass/codebase/themes/elegance.scss",
        "resources/sass/codebase/themes/flat.scss",
        "resources/sass/codebase/themes/pulse.scss",
        "resources/js/codebase/app.js",
        "resources/js/app.js",
        "resources/js/pages/datatables.js",
        "resources/js/pages/form.handler.js",
        "resources/js/pages/datatables.solicitudes.js",
        "resources/js/pages/datatables.solicitudes.credenciales.js",
        "resources/js/pages/credenciales.registrar.js",
        "resources/js/pages/datatables.solicitudes.credenciales.infra.js",
        "resources/js/pages/credenciales.infra.registrar.js",
        "resources/js/pages/MultiSelect.js"
      ],
      refresh: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbG9ndWluLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXGxvZ3Vpbi1hcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3hhbXBwL2h0ZG9jcy9sb2d1aW4tYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFtcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL3Nhc3MvbWFpbi5zY3NzJyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL3Nhc3MvY29kZWJhc2UvdGhlbWVzL2NvcnBvcmF0ZS5zY3NzJyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL3Nhc3MvY29kZWJhc2UvdGhlbWVzL2VhcnRoLnNjc3MnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvc2Fzcy9jb2RlYmFzZS90aGVtZXMvZWxlZ2FuY2Uuc2NzcycsXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9zYXNzL2NvZGViYXNlL3RoZW1lcy9mbGF0LnNjc3MnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvc2Fzcy9jb2RlYmFzZS90aGVtZXMvcHVsc2Uuc2NzcycsXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9qcy9jb2RlYmFzZS9hcHAuanMnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvYXBwLmpzJyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2pzL3BhZ2VzL2RhdGF0YWJsZXMuanMnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvcGFnZXMvZm9ybS5oYW5kbGVyLmpzJyxcbiAgICAgICAgICAgICAgICAncmVzb3VyY2VzL2pzL3BhZ2VzL2RhdGF0YWJsZXMuc29saWNpdHVkZXMuanMnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvcGFnZXMvZGF0YXRhYmxlcy5zb2xpY2l0dWRlcy5jcmVkZW5jaWFsZXMuanMnLCAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvcGFnZXMvY3JlZGVuY2lhbGVzLnJlZ2lzdHJhci5qcycsXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9qcy9wYWdlcy9kYXRhdGFibGVzLnNvbGljaXR1ZGVzLmNyZWRlbmNpYWxlcy5pbmZyYS5qcycsIFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvcGFnZXMvY3JlZGVuY2lhbGVzLmluZnJhLnJlZ2lzdHJhci5qcycsXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9qcy9wYWdlcy9NdWx0aVNlbGVjdC5qcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3USxTQUFTLG9CQUFvQjtBQUNyUyxPQUFPLGFBQWE7QUFFcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0g7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFTO0FBQUEsSUFDYixDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
