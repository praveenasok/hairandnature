async function fetchGoogleRate(pair) {
  const res = await fetch(`https://www.google.com/finance/quote/${pair}`);
  const html = await res.text();
  const match = html.match(/class="YMlKec fxKbKc"[^>]*>([^<]+)<\/div>/);
  if (match) return match[1];
  
  const idx = html.indexOf('jsname="Pdsbrc"');
  if (idx > -1) {
    const spanStart = html.indexOf('<span', idx);
    const textStart = html.indexOf('>', spanStart) + 1;
    const textEnd = html.indexOf('</span>', textStart);
    return html.substring(textStart, textEnd);
  }
  return 'not found';
}
fetchGoogleRate('USD-CAD').then(console.log);
fetch('https://open.er-api.com/v6/latest/USD').then(r=>r.json()).then(d => console.log('er-api CAD:', d.rates.CAD));
