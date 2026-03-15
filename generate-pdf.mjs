import { readFileSync } from 'fs'
import { launch } from 'puppeteer'

// Simple markdown to HTML converter (handles tables, headers, lists, code blocks)
function mdToHtml(md) {
  let html = md

  // Code blocks
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)

  // Tables
  html = html.replace(/(\|.+\|\n)+/g, (table) => {
    const rows = table.trim().split('\n')
    let result = '<table>'
    rows.forEach((row, i) => {
      if (row.match(/^\|[\s-:|]+\|$/)) return // separator row
      const tag = i === 0 ? 'th' : 'td'
      const cells = row.split('|').filter((_, j, a) => j > 0 && j < a.length - 1)
      result += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>'
    })
    return result + '</table>'
  })

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline">$1</code>')

  // Checkbox lists
  html = html.replace(/^- \[x\] (.+)$/gm, '<div class="checklist done">&#9745; $1</div>')
  html = html.replace(/^- \[ \] (.+)$/gm, '<div class="checklist">&#9744; $1</div>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // Paragraphs (lines that aren't already wrapped in HTML)
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
}

const md = readFileSync('/Users/suzukishuto/Desktop/StudyMate/BUSINESS_PLAN.md', 'utf-8')
const bodyHtml = mdToHtml(md)

const fullHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 11px;
    line-height: 1.7;
    color: #1a1a2e;
    padding: 40px 50px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin: 0 0 8px 0;
    padding-bottom: 12px;
    border-bottom: 3px solid #5da5ea;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #5da5ea, #3ac9b4);
    padding: 8px 16px;
    border-radius: 8px;
    margin: 24px 0 12px 0;
    page-break-after: avoid;
  }

  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #5da5ea;
    margin: 16px 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #e0e0e0;
    page-break-after: avoid;
  }

  h4 {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    margin: 12px 0 6px 0;
  }

  p {
    margin: 4px 0;
    text-align: justify;
  }

  strong { color: #1a1a2e; }

  hr {
    border: none;
    border-top: 1px solid #e8e8e8;
    margin: 20px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 10.5px;
  }

  th {
    background: #f0f7ff;
    color: #1a1a2e;
    font-weight: 700;
    padding: 6px 10px;
    border: 1px solid #d0d8e8;
    text-align: left;
  }

  td {
    padding: 5px 10px;
    border: 1px solid #e0e0e0;
    vertical-align: top;
  }

  tr:nth-child(even) td { background: #fafbfd; }

  ul, ol {
    margin: 6px 0 6px 20px;
  }

  li {
    margin: 2px 0;
  }

  pre {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: 'SF Mono', monospace;
    font-size: 10px;
    overflow-x: auto;
    margin: 8px 0;
    page-break-inside: avoid;
  }

  code.inline {
    background: #f0f0f0;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 10px;
    font-family: 'SF Mono', monospace;
  }

  .checklist {
    margin: 2px 0 2px 8px;
    font-size: 11px;
  }
  .checklist.done { color: #2d8f2d; }

  /* Page breaks */
  h2:nth-of-type(4) { page-break-before: always; } /* ビジネスモデル */
  h2:nth-of-type(7) { page-break-before: always; } /* 開発ロードマップ */
  h2:nth-of-type(9) { page-break-before: always; } /* リスクと対策 */

  @page {
    size: A4;
    margin: 15mm 12mm;
  }

  /* Footer */
  @page {
    @bottom-center {
      content: counter(page);
    }
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`

const browser = await launch({ headless: true })
const page = await browser.newPage()
await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

await page.pdf({
  path: '/Users/suzukishuto/Desktop/StudyMate/BUSINESS_PLAN.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size:9px;text-align:center;width:100%;color:#999;">StudyMate 事業計画書 — <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
})

await browser.close()
console.log('PDF generated: /Users/suzukishuto/Desktop/StudyMate/BUSINESS_PLAN.pdf')
