#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

// HEX 转 RGB
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

// RGB 转 HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// RGB 转 HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// HSL 转 RGB
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// 生成调色板
function generatePalette(baseColor, options) {
  const palette = [];
  const { h, s, l } = rgbToHsl(
    baseColor.r,
    baseColor.g,
    baseColor.b
  );
  
  const count = options.count || 10;
  
  for (let i = 0; i < count; i++) {
    const newL = Math.min(100, Math.max(0, l + (i - count / 2) * 10));
    const rgb = hslToRgb(h, s / 100, newL / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    palette.push({
      hex,
      rgb,
      hsl: { h, s, l: newL }
    });
  }
  
  return palette;
}

// 显示颜色块
function displayColorBlock(hex, rgb, hsl, options) {
  const { preview } = options;
  const hexClean = hex.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  
  if (preview) {
    // 使用 ANSI 颜色显示
    const ansiColor = `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m\x1b[38;2;255;255;255m  \x1b[0m`;
    console.log(`${ansiColor} ${hexClean}`);
    console.log(`  ${rgbStr}`);
    console.log(`  ${hslStr}\n`);
  } else {
    console.log(chalk.hex(hexClean)(hexClean));
    console.log(`  ${rgbStr}`);
    console.log(`  ${hslStr}\n`);
  }
}

// 生成随机颜色
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b)
  };
}

// CLI 配置
program
  .name('color-picker')
  .description('颜色选择工具 - 生成和转换颜色代码')
  .version('1.0.0');

program
  .command('convert <hex>')
  .option('--hsl', '显示 HSL 格式')
  .option('--no-preview', '不显示颜色预览')
  .description('转换颜色格式')
  .action((hex, options) => {
    console.log(chalk.cyan('\n🎨 颜色转换\n'));
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hexClean = hex.toUpperCase();
    
    console.log(chalk.hex(hexClean)(`HEX: ${hexClean}`));
    console.log(chalk.white(`RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`));
    console.log(chalk.white(`HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\n`));
    
    displayColorBlock(hexClean, rgb, hsl, { preview: true });
  });

program
  .command('palette <hex>')
  .option('-n, --count <number>', '颜色数量', parseInt)
  .option('--preview', '显示颜色预览')
  .description('生成调色板')
  .action((hex, options) => {
    console.log(chalk.cyan('\n🎨 调色板生成\n'));
    
    const rgb = hexToRgb(hex);
    const palette = generatePalette(rgb, {
      count: options.count || 10
    });
    
    console.log(`基于 ${hex.toUpperCase()} 生成 ${palette.length} 个颜色\n`);
    
    for (const color of palette) {
      displayColorBlock(color.hex, color.rgb, color.hsl, {
        preview: options.preview || false
      });
    }
  });

program
  .command('random')
  .option('-n, --count <number>', '生成数量', parseInt)
  .option('--preview', '显示颜色预览')
  .description('生成随机颜色')
  .action((options) => {
    console.log(chalk.cyan('\n🎨 随机颜色\n'));
    
    const count = options.count || 1;
    
    for (let i = 0; i < count; i++) {
      const color = randomColor();
      console.log(`颜色 ${i + 1}:`);
      displayColorBlock(color.hex, color.rgb, color.hsl, {
        preview: options.preview || false
      });
    }
  });

program.parse();
