## 一键 SVG 文件转 React 组件

```
npm i -g quick-icon
```

配置文件默认读取 `.qicon.js`，可通过 `qicon -c xxx.js` 指定。

配置文件格式：

```js
module.exports = {
  // 有色 svg 列表
  colorIcon: [
    {
      // 名称
      name: "goal",
      // svg 内容
      content: `<?xml version="1.0" encoding="UTF-8"?>`,
    },
  ],
  // 单色 svg 列表
  solidColorIcon: [
    {
      name: "lock",
      content: `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z"/><path d="M10.5 6.3v-1a2.5 2.5 0 0 0-5 0v1h5zm1.5 1H4v6h8v-6zM9.75 9.8a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25v-.5a.25.25 0 0 1 .25-.25zM4.5 5.3a3.5 3.5 0 0 1 7 0v1h.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h.5v-1z" fill="#0D5DFF" class="fill-line"/></g></svg>`,
    },
  ],
  // 从文件夹读取彩色 svg 文件
  colorIconDirPath: "./",
  // 从文件夹读取单色 svg 文件
  solidColorIconDirPath: "./",

  // React 组件 TSX 导出目录
  output: "./dist",

  // React 组件前缀
  compoentPrefix: "Icon",
};
```

在配置文件列表中的 svg 会和从文件读取的 svg 取并集。

生成效果：

index.tsx

```tsx
import React, { FC } from "react";

type TProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const Icongoal: FC<TProps> = ({ className, style = {} }) => (
  <div
    style={{
      background:
        'url("data:image/svg+xml,%3Csvg...%3E%3C%2Fsvg%3E") no-repeat',
      backgroundSize: "100% 100%",
      backgroundColor: "transparent",
      width: "1em",
      height: "1em",
      ...style,
    }}
    className={className}
  />
);

export const Iconlocak: FC<TProps> = ({ className, style = {} }) => (
  <div
    style={{
      mask: 'url("data:image/svg+xml,%3Csvg%...3C%2Fsvg%3E") no-repeat',
      WebkitMask: 'url("data:image/svg+xml,%3Csvg%...vg%3E") no-repeat',
      backgroundColor: "currentColor",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      width: "1em",
      height: "1em",
      ...style,
    }}
    className={className}
  />
);
```

直接导入 `index.tsx` 即可以消费图标，纯色图标可通过 `color` CSS 属性进行改色。

执行效果：

```bash
$ qicon

⏳ ===> 查找单色图标
---> 📄 找到单色图标: bread-delimiter.svg
---> 📄 找到单色图标: icon-copy.svg
---> 📄 找到单色图标: icon-delete.svg
---> 📄 找到单色图标: icon-edit.svg
---> 📄 找到单色图标: icon-lock.svg
---> 📄 找到单色图标: icon-one.svg
---> 📄 找到单色图标: info.svg
---> 📄 找到单色图标: min.svg
---> 📄 找到单色图标: send.svg
---> 📄 找到单色图标: terminal-icon-all.svg
---> 📄 找到单色图标: terminal-icon-folder.svg
---> 📄 找到单色图标: 运营.svg

⏳ ===> 生成颜色图标
---> ✅ 生成成功: goal

⏳ ===> 生成单色图标
---> ✅ 生成成功: locak
---> ✅ 生成成功: bread-delimiter
---> ✅ 生成成功: icon-copy
---> ✅ 生成成功: icon-delete
---> ✅ 生成成功: icon-edit
---> ✅ 生成成功: icon-lock
---> ✅ 生成成功: icon-one
---> ✅ 生成成功: info
---> ✅ 生成成功: min
---> ✅ 生成成功: send
---> ✅ 生成成功: terminal-icon-all
---> ✅ 生成成功: terminal-icon-folder
---> ✅ 生成成功: 运营

⏳ ===> 生成组件文件 index.tsx
---> ✅ 生成成功: index.tsx

⏳ ===> 生成预览文件 preview.html
---> ✅ 生成成功: preview.html

 🎉 执行完成 🎉
```
