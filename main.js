const { optimize } = require("svgo");
const fs = require("fs");
const path = require("path");

const cIndex = process.argv.indexOf("-c");
const configFileName =
  cIndex === -1 || cIndex === process.argv.length - 1
    ? "./.qicon.js"
    : process.argv[process.argv.indexOf("-c") + 1];

const duplicateNames = [];
let config = {};
let tsStr = `import React, { FC } from 'react'

type TProps = {
  className?: string
  style?: React.CSSProperties
}

`;
let previewStr = "";
let previewStrIndex = 0;

function toCamelCase(str) {
  const parts = str.split("-");

  return parts
    .map((part, index) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

try {
  config = require(`${path.resolve(process.cwd(), configFileName)}`);
  config.output = config.output || "./icons";
} catch (error) {
  console.error("🚫 无法读取配置文件：", error);
  process.exit(1);
}

if (fs.existsSync(config.colorIconDirPath)) {
  console.log("⏳ ===> 查找颜色图标");
  const files = fs.readdirSync(config.colorIconDirPath);
  files.forEach((file) => {
    if (file.endsWith(".svg")) {
      console.log(`---> 📊 找到颜色图标: ${file}`);
      const content = fs.readFileSync(
        path.resolve(config.colorIconDirPath, file),
        "utf-8"
      );
      config.colorIcon.push({
        name: file.replace(".svg", ""),
        content,
      });
    }
  });
}

if (fs.existsSync(config.solidColorIconDirPath)) {
  console.log("\n⏳ ===> 查找单色图标");
  const files = fs.readdirSync(config.solidColorIconDirPath);
  files.forEach((file) => {
    if (file.endsWith(".svg")) {
      console.log(`---> 📄 找到单色图标: ${file}`);
      const content = fs.readFileSync(
        path.resolve(config.solidColorIconDirPath, file),
        "utf-8"
      );
      config.solidColorIcon.push({
        name: file.replace(".svg", ""),
        content,
      });
    }
  });
}

config.solidColorIcon.forEach((item) => {
  if (config.colorIcon.some((obj) => obj.name === item.name)) {
    duplicateNames.push(item.name);
  }
});

if (duplicateNames.length > 0) {
  console.error(`\n🚫 以下图标重名：${duplicateNames.join(", ")}`);
  process.exit(1);
}

if (!fs.existsSync(config.output)) {
  fs.mkdirSync(config.output, { recursive: true });
}

console.log("\n⏳ ===> 生成颜色图标");
config.colorIcon.forEach((item) => {
  try {
    const result = optimize(item.content, {
      plugins: [
        { name: "removeAttrs", params: { attrs: "class" } },
        {
          name: "preset-default",
        },
      ],
    });

    tsStr += `export const ${
      config.compoentPrefix + toCamelCase(item.name)
    }: FC<TProps> = ({ className, style = {} }) => (
  <div
    style={{
      background: 'url("data:image/svg+xml,${encodeURIComponent(
        result.data
      )}") no-repeat',
      backgroundSize: '100% 100%',
      backgroundColor: 'transparent',
      width: '1em',
      height: '1em',
      ...style,
    }}
    className={className}
  />
);

`;
    previewStr += `<div class="a"><div class="icon"
style="background: url('data:image/svg+xml,${encodeURIComponent(
      result.data
    )}') no-repeat;
  background-size: 100% 100%;
  background-color: transparent;
  width: 1em;
  height: 1em;"
></div>${++previewStrIndex}.${item.name}</div>`;

    console.log(`---> ✅ 生成成功: ${item.name}`);
  } catch (error) {
    console.log(`---> ❌ 生成失败: ${item.name}`);
  }
});

console.log("\n⏳ ===> 生成单色图标");
config.solidColorIcon.forEach((item) => {
  try {
    const result = optimize(item.content, {
      plugins: [
        { name: "removeAttrs", params: { attrs: "class" } },
        {
          name: "preset-default",
        },
        {
          name: "fill-currentColor",
          fn: () => {
            return {
              element: {
                enter: (node) => {
                  if (
                    node.attributes.fill == null ||
                    node.attributes.fill == "" ||
                    node.attributes.fill == "none"
                  ) {
                    return;
                  }

                  node.attributes.fill = "currentColor";
                },
              },
            };
          },
        },
      ],
    });

    tsStr += `export const ${
      config.compoentPrefix + toCamelCase(item.name)
    }: FC<TProps> = ({ className, style = {} }) => (
  <div
    style={{
      mask: 'url("data:image/svg+xml,${encodeURIComponent(
        result.data
      )}") no-repeat',
      WebkitMask: 'url("data:image/svg+xml,${encodeURIComponent(
        result.data
      )}") no-repeat',
      backgroundColor: 'currentColor',
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      width: '1em',
      height: '1em',
      ...style,
    }}
    className={className}
  />
);

`;
    previewStr += `<div class="a"><div class="icon"
    style="mask: url('data:image/svg+xml,${encodeURIComponent(
      result.data
    )}') no-repeat;
      -webkit-mask: url('data:image/svg+xml,${encodeURIComponent(
        result.data
      )}') no-repeat;
      background-color: currentColor;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      width: 1em;
      height: 1em;" 
  ></div>${++previewStrIndex}.${item.name}</div>`;
    console.log(`---> ✅ 生成成功: ${item.name}`);
  } catch (error) {
    console.log(`---> ❌ 生成失败: ${item.name}`);
  }
});

console.log("\n⏳ ===> 生成组件文件 index.tsx");
try {
  fs.writeFileSync(path.resolve(config.output, "index.tsx"), tsStr);
  console.log("---> ✅ 生成成功: index.tsx");
} catch (error) {
  console.log("---> ❌ 生成失败: index.tsx");
}

console.log("\n⏳ ===> 生成预览文件 preview.html");
try {
  fs.writeFileSync(
    path.resolve(config.output, "preview.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Icon Preview</title>
  <style>
    .icon {
      display: inline-block;
      width: 2em!important;
      height: 2em!important;
      margin: 1em;
      transition: all .3s;
    }
    .a:hover .icon{
      filter: drop-shadow(0 0 2px rgba(0, 0, 0, .5));
      transform: scale(1.5);
      transition: all .3s;
      color: pink;
    }
    .a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 1em;
      border: 1px solid #ccc;
    }
    body{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      padding: 2em;
    }
  </style>
</head>
<body>
  ${previewStr}
</body>
</html>`
  );
  console.log("---> ✅ 生成成功: preview.html");
} catch (error) {
  console.log("---> ❌ 生成失败: preview.html");
}

console.log("\n 🎉 执行完成 🎉");
