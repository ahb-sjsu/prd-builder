export function downloadAsWord(html: string, productName: string) {
  const name = productName || 'Product';
  const docHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.7;color:#111;margin:1in}
h1{font-size:20pt;color:#0d1117;border-bottom:2pt solid #0d1117;padding-bottom:8pt;margin-bottom:6pt}
h2{font-size:14pt;color:#1a3a5c;border-left:4pt solid #e8a020;padding-left:8pt;margin-top:22pt;margin-bottom:8pt}
h3{font-size:11pt;color:#2c3e50;text-transform:uppercase;letter-spacing:.5pt;margin-top:14pt}
p{margin-bottom:8pt;color:#2d3748}ul,ol{margin:6pt 0 12pt 20pt}li{margin-bottom:4pt;color:#2d3748}strong{color:#1a1a2e}
.dmeta{font-size:9pt;color:#888;font-family:monospace;margin-bottom:28pt}
.comp-banner{background:#fff8e6;border:1pt solid #e8a020;padding:10pt 14pt;margin-bottom:18pt}
.comp-banner-title{font-size:10pt;font-weight:bold;color:#8a5c00;margin-bottom:4pt}
.comp-banner-text{font-size:10pt;color:#5a4000}
</style></head><body>${html}</body></html>`;

  const blob = new Blob([docHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_')}_PRD_${new Date().toISOString().slice(0, 10)}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
