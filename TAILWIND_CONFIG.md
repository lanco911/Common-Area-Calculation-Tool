# Tailwind CSS 配置说明

本项目使用 Tailwind CSS 作为样式框架，以下是配置说明：

## 配置文件位置

- `tailwind.config.js` - Tailwind CSS 主配置文件
- `postcss.config.js` - PostCSS 配置文件

## 主要配置项

### 内容路径

```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

这告诉 Tailwind CSS 扫描哪些文件中的类名。

### 主题扩展

```javascript
theme: {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... 更多颜色配置
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
},
```

这些扩展配置与 shadcn/ui 组件库兼容，使用 CSS 变量定义颜色和边框圆角。

### 插件

```javascript
plugins: [require("tailwindcss-animate")],
```

添加了 `tailwindcss-animate` 插件，用于动画效果。

## CSS 变量

在 `src/index.css` 中定义了以下 CSS 变量：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    // ... 更多变量
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    // ... 暗色主题变量
  }
}
```

这些变量与 Tailwind CSS 配置中的颜色扩展相对应，支持亮色和暗色主题。

## 使用方法

在组件中使用 Tailwind CSS 类名：

```jsx
<div className="flex items-center justify-center p-4 bg-primary text-primary-foreground rounded-lg">
  <h1 className="text-xl font-bold">标题</h1>
</div>
```

## 自定义样式

如需添加自定义样式，可以在 `tailwind.config.js` 的 `theme.extend` 部分添加配置，或者在组件中使用 `@apply` 指令：

```css
.custom-button {
  @apply bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90;
}
```

## 构建过程

Tailwind CSS 在构建过程中会扫描所有指定的文件，提取使用的类名，并生成优化的 CSS 文件。这个过程由 Vite 处理，配置在 `vite.config.ts` 中。