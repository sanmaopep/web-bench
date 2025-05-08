import { Pipe, PipeTransform, SecurityContext } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'marked',
  standalone: true,
})
export class MarkedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return ''

    const html = this.markdownToHtml(value)
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, html)
    return this.sanitizer.bypassSecurityTrustHtml(sanitized || '')
  }

  private markdownToHtml(markdown: string): string {
    let html = markdown

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Lists
    html = html.replace(/^\* (.+)/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Line breaks
    html = html.replace(/\n/g, '<br>')

    // Paragraphs
    html = html.replace(/^(?!<[uh]|<pre|<br)(.+)$/gm, '<p>$1</p>')

    // Remove empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '')

    // Fix nested paragraphs in lists
    html = html.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>')

    // Fix multiple line breaks
    html = html.replace(/(<br>){3,}/g, '<br><br>')

    return html
  }
}
