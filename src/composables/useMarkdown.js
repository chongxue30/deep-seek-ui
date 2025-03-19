// src/composables/useMarkdown.js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

export function useMarkdown() {
    // Initialize markdown-it with code highlighting
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    const highlighted = hljs.highlight(str, { language: lang }).value
                    // Add copy button to code blocks
                    return `<div class="code-block-wrapper">
                    <div class="code-header">
                      <span class="code-language">${lang}</span>
                      <button class="code-copy-btn" onclick="copyCodeToClipboard(this)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                        <span>复制</span>
                      </button>
                    </div>
                    <pre class="hljs"><code>${highlighted}</code></pre>
                  </div>`
                } catch (__) {}
            }
            return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
        }
    })

    // Function to format markdown text
    const formatMarkdown = (text) => {
        if (!text) return ''
        return md.render(text)
    }

    return {
        formatMarkdown
    }
}
