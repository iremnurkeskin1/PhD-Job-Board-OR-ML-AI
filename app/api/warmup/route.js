export const runtime = 'nodejs';

const CATEGORIES = [
  { q:'operations research scientist optimization engineer', kw:['operations research scientist','optimization scientist','optimization engineer'] },
  { q:'machine learning research scientist', kw:['machine learning research scientist','ml research scientist','machine learning scientist'] },
  { q:'artificial intelligence research scientist', kw:['ai research scientist','deep learning scientist'] },
  { q:'reinforcement learning researcher', kw:['reinforcement learning researcher','rl researcher'] },
  { q:'nlp scientist researcher', kw:['nlp scientist','nlp researcher','llm scientist'] },
  { q:'quantitative researcher', kw:['quantitative researcher','quant researcher'] },
  { q:'applied scientist', kw:['applied scientist','applied research scientist'] },
  { q:'machine learning phd intern', kw:['machine learning research intern','ml research intern'] },
  { q:'quantitative research intern phd', kw:['quantitative research intern','quant intern'] },
];

export async function GET(request) {
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const base = proto + '://' + host;

  const results = [];
  for (const cat of CATEGORIES) {
    try {
      const params = new URLSearchParams({ q:cat.q, kw:JSON.stringify(cat.kw) });
      const res = await fetch(base + '/api/jobs?' + params.toString(), { signal:AbortSignal.timeout(20000) });
      const data = await res.json();
      results.push({ q:cat.q, total:data.total||0, fromCache:data.fromCache||false });
    } catch(e) {
      results.push({ q:cat.q, error:e.message });
    }
  }

  return Response.json({ warmedAt:new Date().toISOString(), categories:results });
}
