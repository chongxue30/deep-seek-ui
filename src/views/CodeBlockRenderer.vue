<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import scala from 'highlight.js/lib/languages/scala';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import css from 'highlight.js/lib/languages/css';
import less from 'highlight.js/lib/languages/less';
import scss from 'highlight.js/lib/languages/scss';
import 'highlight.js/styles/atom-one-dark.css';

// 注册所有导入的语言
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('java', java);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('scala', scala);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('css', css);
hljs.registerLanguage('less', less);
hljs.registerLanguage('scss', scss);


const props = defineProps({
  content: {
    type: String,
    default: ''
  }
});

// 语言映射表，将常见的语言别名映射到highlight.js支持的语言名称
const languageMap = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'c++': 'cpp',
  'cpp': 'cpp',
  'cs': 'csharp',
  'c#': 'csharp',
  'sh': 'bash',
  'yml': 'yaml',
  'html': 'xml',
  'jsx': 'javascript',
  'tsx': 'typescript',
  'md': 'markdown',
  'rb': 'ruby',
  'kt': 'kotlin',
  'golang': 'go',
  'rs': 'rust',
  'sass': 'scss',
  'bat': 'bash',
  'powershell': 'bash',
  'ps': 'bash',
  'shell': 'bash',
  'dockerfile': 'bash',
  'docker': 'bash',
  'txt': 'plaintext',
  'text': 'plaintext'
};

// 创建MarkdownIt实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 映射语言别名
    const mappedLang = languageMap[lang.toLowerCase()] || lang;

    if (mappedLang && hljs.getLanguage(mappedLang)) {
      try {
        return hljs.highlight(str, { language: mappedLang, ignoreIllegals: true }).value;
      } catch (error) {
        console.error(`高亮处理错误: ${error.message}`);
      }
    }

    // 如果没有指定语言或语言不支持，尝试自动检测
    try {
      const result = hljs.highlightAuto(str);
      return result.value;
    } catch (error) {
      console.error(`自动高亮处理错误: ${error.message}`);
    }

    // 如果都失败了，返回转义后的文本
    return md.utils.escapeHtml(str);
  }
});

// 自定义渲染器，添加复制按钮和语言标签
md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
  const langName = info ? info.split(/\s+/g)[0] : '';
  const mappedLang = languageMap[langName.toLowerCase()] || langName;

  let highlighted;
  if (options.highlight) {
    try {
      highlighted = options.highlight(token.content, mappedLang, env) || md.utils.escapeHtml(token.content);
    } catch (error) {
      console.error(`渲染高亮错误: ${error.message}`);
      highlighted = md.utils.escapeHtml(token.content);
    }
  } else {
    highlighted = md.utils.escapeHtml(token.content);
  }

  const displayLang = mappedLang || langName || 'text';
  const uniqueId = `code-block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return `
    <div class="code-block-wrapper" id="${uniqueId}">
      <div class="code-header">
        <span class="code-language">${displayLang.toUpperCase()}</span>
        <button class="code-copy-btn" data-target="${uniqueId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
          <span>复制代码</span>
        </button>
      </div>
      <pre class="hljs"><code class="language-${displayLang}">${highlighted}</code></pre>
    </div>
  `;
};

// 预处理内容，识别各种代码块格式
const preprocessContent = (content) => {
  if (!content) return '';

  let processedContent = content;

  // 1. 移除思考过程部分和其他特殊内容
  processedContent = processedContent.replace(/<details.*?<\/details>/gs, '');
  processedContent = processedContent.replace(/\{\s*"action":\s*".*?",\s*"action_input":\s*"(.*?)"\s*\}/gs, (match, capturedText) => {
    return capturedText
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
  });
  processedContent = processedContent.replace(/TEXT\s*/g, '');
  processedContent = processedContent.replace(/复制代码\s*/g, '');

  // 2. 识别特定编程语言模式并标记代码块

  // 2.1 处理Go语言代码 - 识别package/import/func模式
  const goPattern = /(package\s+\w+|import\s+(?:"[\w\/]+"|\([\s\S]*?\))|func\s+\w+\s*\([^)]*\)[\s\S]*?\{)/g;
  if (goPattern.test(processedContent)) {
    // 找到语言描述行
    const goHeaderMatch = processedContent.match(/(Go|Golang)(?:语言)?(?:冒泡排序|算法|实现|代码).*?(?:：|:)/i);

    if (goHeaderMatch) {
      const headerEndPos = goHeaderMatch.index + goHeaderMatch[0].length;
      // 从描述后提取代码内容直到明显的分隔符
      const codeMatch = processedContent.substring(headerEndPos).match(/\s*([\s\S]*?)(?=\n\n核心技术点|\n\n注：|\n\n\w+|\n复制\n播放|$)/);

      if (codeMatch) {
        const codeContent = codeMatch[1].trim();
        // 构建代码块
        const beforeCode = processedContent.substring(0, headerEndPos);
        const afterCode = processedContent.substring(headerEndPos + codeMatch[0].length);

        processedContent = beforeCode + '\n```go\n' + codeContent + '\n```\n' + afterCode;
      }
    } else {
      // 如果没有明确的语言头，尝试直接包装看起来像Go代码的部分
      processedContent = processedContent.replace(
          /(package\s+\w+[\s\S]*?func\s+main\s*\(\)[\s\S]*?\})\s*(?=\n\n|$)/g,
          (match) => {
            return '```go\n' + match.trim() + '\n```\n';
          }
      );
    }
  }

  // 2.2 识别SQL代码块
  const sqlPattern = /(?:CREATE DATABASE|CREATE TABLE|INSERT INTO|SELECT|UPDATE|DELETE|USE|ALTER)[\s\S]*?;/gi;
  let match;
  const sqlBlocks = [];

  while ((match = sqlPattern.exec(processedContent)) !== null) {
    const startIdx = match.index;
    const endIdx = match.index + match[0].length;

    // 寻找段落的实际开始位置
    let blockStart = startIdx;
    while (blockStart > 0 && processedContent[blockStart-1] !== '\n') {
      blockStart--;
    }

    // 检查是否是带有注释的SQL块
    const prefix = processedContent.substring(blockStart, startIdx).trim();
    if (prefix.startsWith('–') || prefix.startsWith('--')) {
      sqlBlocks.push({
        start: blockStart,
        end: endIdx,
        text: processedContent.substring(blockStart, endIdx)
      });
    } else if (prefix === '') {
      sqlBlocks.push({
        start: startIdx,
        end: endIdx,
        text: match[0]
      });
    }
  }

  // 合并相邻的SQL块
  const mergedBlocks = [];
  for (let i = 0; i < sqlBlocks.length; i++) {
    if (i > 0 && sqlBlocks[i].start - sqlBlocks[i-1].end < 10) {
      mergedBlocks[mergedBlocks.length-1].end = sqlBlocks[i].end;
      mergedBlocks[mergedBlocks.length-1].text += '\n' + sqlBlocks[i].text;
    } else {
      mergedBlocks.push(sqlBlocks[i]);
    }
  }

  // 从后往前替换SQL块
  mergedBlocks.sort((a, b) => b.start - a.start);
  for (const block of mergedBlocks) {
    const before = processedContent.substring(0, block.start);
    const after = processedContent.substring(block.end);
    processedContent = before + '\n```sql\n' + block.text.trim() + '\n```\n' + after;
  }

  // 3. 处理其他常见语言模式

  // 3.1 修复处理HTML代码块的逻辑

  // 清理重复的代码块标记
  processedContent = processedContent.replace(/```html\s*```html/g, '```html');

  // 处理"以下是符合现代Web标准的登录页面HTML"等引导语后的HTML代码
  processedContent = processedContent.replace(
      /(?:以下是符合现代Web标准的登录页面HTML|以下是\w+的HTML代码|这是一个HTML示例)(?:[：:])?\s*\n+(?:XML|HTML)?\s*\n+(?:```html)?\s*\n*(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>|<head[\s\S]*?<\/body>|<div[\s\S]*?<\/div>|<form[\s\S]*?<\/form>)\s*(?:```)?/gi,
      (match, code) => {
        // 确保代码不会被重复包装
        return `以下是HTML代码：\n\`\`\`html\n${code.trim()}\n\`\`\`\n\n`;
      }
  );

  // 处理HTML标签序列
  processedContent = processedContent.replace(
      /(?:html|HTML)\s*\n+(?!```)(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>|<head[\s\S]*?<\/body>|<div[\s\S]*?<\/div>|<form[\s\S]*?<\/form>)/g,
      (match, code) => {
        if (!code.trim()) return match;
        return `\n\`\`\`html\n${code.trim()}\n\`\`\`\n\n`;
      }
  );

  // 独立的HTML代码块检测
  processedContent = processedContent.replace(
      /(?<!```[\s\S]*?)(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)(?![\s\S]*?```)/g,
      (match) => {
        return `\n\`\`\`html\n${match.trim()}\n\`\`\`\n\n`;
      }
  );

  // 3.2 处理独立的语言标识符行
  processedContent = processedContent.replace(
      /\n(CPP|JAVA|PYTHON|JS|JAVASCRIPT|CSHARP|C#|GO|GOLANG|RUBY|PHP|SWIFT|KOTLIN|SCALA|SQL|BASH|SHELL|XML|JSON|YAML|MARKDOWN|CSS|HTML)\s*\n+([\s\S]*?)(?=\n\n注：|\n\n核心|\n\n\w+|\n\n这是|\n复制\n播放|\n\n$|$)/gi,
      (match, lang, code) => {
        if (!code.trim()) return match;

        let langId = lang.toLowerCase();
        if (langId === 'c#') langId = 'csharp';
        if (langId === 'javascript') langId = 'js';
        if (langId === 'golang') langId = 'go';

        return `\n\`\`\`${langId}\n${code.trim()}\n\`\`\`\n\n`;
      }
  );

  // 4. 确保所有代码块都有闭合标记
  let lines = processedContent.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```') && !inCodeBlock) {
      inCodeBlock = true;
    } else if (lines[i] === '```' && inCodeBlock) {
      inCodeBlock = false;
    }
  }

  if (inCodeBlock) {
    lines.push('```');
  }

  return lines.join('\n');
};



// 复制代码功能
const copyCodeToClipboard = (event) => {
  const button = event.target.closest('.code-copy-btn');
  if (!button) return;

  const blockId = button.getAttribute('data-target');
  const codeBlock = document.getElementById(blockId)?.querySelector('code');

  if (!codeBlock) {
    console.error('找不到代码块元素');
    return;
  }

  const codeText = codeBlock.textContent || '';

  try {
    navigator.clipboard.writeText(codeText).then(() => {
      const originalText = button.querySelector('span').textContent;
      button.querySelector('span').textContent = '已复制!';
      setTimeout(() => {
        button.querySelector('span').textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    });
  } catch (error) {
    console.error('复制操作错误:', error);

    // 回退方法：使用document.execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = codeText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        const originalText = button.querySelector('span').textContent;
        button.querySelector('span').textContent = '已复制!';
        setTimeout(() => {
          button.querySelector('span').textContent = originalText;
        }, 2000);
      } else {
        alert('复制失败，请手动复制');
      }
    } catch (fallbackError) {
      console.error('回退复制方法失败:', fallbackError);
      alert('复制失败，请手动复制');
    }
  }
};

// 渲染内容
const renderedContent = computed(() => {
  try {
    const processedContent = preprocessContent(props.content);
    return md.render(processedContent);
  } catch (error) {
    console.error('渲染内容错误:', error);
    return `<div class="error-message">渲染错误: ${error.message}</div>`;
  }
});

// 事件处理函数
const handleClick = (event) => {
  if (event.target.closest('.code-copy-btn')) {
    copyCodeToClipboard(event);
  }
};

// 在组件挂载后添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClick);
});

// 在组件卸载前移除事件监听，防止内存泄漏
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick);
});
</script>

<style scoped>
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 100%;
  overflow-x: auto;
}

.markdown-content :deep(pre) {
  margin: 0;
  padding: 0;
}

.markdown-content :deep(code) {
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 4;
  white-space: pre;
}

.markdown-content :deep(.code-block-wrapper) {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d333b;
  color: #e6edf3;
  font-size: 0.85rem;
}

.markdown-content :deep(.code-language) {
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.markdown-content :deep(.code-copy-btn) {
  background: #444c56;
  border: none;
  border-radius: 4px;
  color: #e6edf3;
  padding: 4px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.2s;
}

.markdown-content :deep(.code-copy-btn:hover) {
  background: #545d68;
}

.markdown-content :deep(.hljs) {
  display: block;
  overflow-x: auto;
  padding: 1em;
  background: #22272e;
  color: #adbac7;
}

/* 错误消息样式 */
.markdown-content :deep(.error-message) {
  padding: 1rem;
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
  margin: 1rem 0;
  border-radius: 4px;
}

/* 针对不同语言的代码块添加不同的左边框颜色 */
.markdown-content :deep(.language-javascript),
.markdown-content :deep(.language-js) {
  border-left: 4px solid #f7df1e;
}

.markdown-content :deep(.language-typescript),
.markdown-content :deep(.language-ts) {
  border-left: 4px solid #3178c6;
}

.markdown-content :deep(.language-python),
.markdown-content :deep(.language-py) {
  border-left: 4px solid #3776ab;
}

.markdown-content :deep(.language-cpp),
.markdown-content :deep(.language-c++) {
  border-left: 4px solid #00599c;
}

.markdown-content :deep(.language-java) {
  border-left: 4px solid #b07219;
}

.markdown-content :deep(.language-csharp),
.markdown-content :deep(.language-cs) {
  border-left: 4px solid #178600;
}

.markdown-content :deep(.language-go) {
  border-left: 4px solid #00add8;
}

.markdown-content :deep(.language-rust) {
  border-left: 4px solid #dea584;
}

.markdown-content :deep(.language-ruby) {
  border-left: 4px solid #cc342d;
}

.markdown-content :deep(.language-php) {
  border-left: 4px solid #4f5d95;
}

.markdown-content :deep(.language-swift) {
  border-left: 4px solid #ffac45;
}

.markdown-content :deep(.language-kotlin) {
  border-left: 4px solid #a97bff;
}

.markdown-content :deep(.language-scala) {
  border-left: 4px solid #c22d40;
}

.markdown-content :deep(.language-sql) {
  border-left: 4px solid #e38c00;
}

.markdown-content :deep(.language-bash),
.markdown-content :deep(.language-shell) {
  border-left: 4px solid #89e051;
}

.markdown-content :deep(.language-xml),
.markdown-content :deep(.language-html) {
  border-left: 4px solid #e34c26;
}

.markdown-content :deep(.language-json) {
  border-left: 4px solid #292929;
}

.markdown-content :deep(.language-yaml) {
  border-left: 4px solid #cb171e;
}

.markdown-content :deep(.language-markdown),
.markdown-content :deep(.language-md) {
  border-left: 4px solid #083fa1;
}

.markdown-content :deep(.language-css) {
  border-left: 4px solid #563d7c;
}

.markdown-content :deep(.language-scss),
.markdown-content :deep(.language-sass) {
  border-left: 4px solid #c6538c;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .markdown-content {
    color: #e6edf3;
  }

  .markdown-content :deep(.error-message) {
    background-color: rgba(220, 38, 38, 0.1);
    color: #ef4444;
    border-left: 4px solid #ef4444;
  }
}
</style>
