export const runtime = 'nodejs';
export const maxDuration = 25;

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCached(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.cachedAt > CACHE_TTL) { cache.delete(key); return null; }
  return e.jobs;
}
function setCached(key, jobs) {
  if (cache.size >= 50) cache.delete(cache.keys().next().value);
  cache.set(key, { jobs, cachedAt: Date.now() });
}

const GREENHOUSE = [
  { token:'anthropic',            name:'Anthropic',             sector:'Industry' },
  { token:'openai',               name:'OpenAI',                sector:'Industry' },
  { token:'deepmind',             name:'Google DeepMind',       sector:'Industry' },
  { token:'togetherai',           name:'Together AI',           sector:'Industry' },
  { token:'cohere',               name:'Cohere',                sector:'Industry' },
  { token:'scaleai',              name:'Scale AI',              sector:'Industry' },
  { token:'fireworksai',          name:'Fireworks AI',          sector:'Industry' },
  { token:'assemblyai',           name:'AssemblyAI',            sector:'Industry' },
  { token:'gleanwork',            name:'Glean',                 sector:'Industry' },
  { token:'lilasciences',         name:'Lila Sciences',         sector:'Industry' },
  { token:'waymo',                name:'Waymo',                 sector:'Industry' },
  { token:'palantir',             name:'Palantir',              sector:'Industry' },
  { token:'nvidia',               name:'NVIDIA',                sector:'Industry' },
  { token:'databricks',           name:'Databricks',            sector:'Industry' },
  { token:'stripe',               name:'Stripe',                sector:'Industry' },
  { token:'lyft',                 name:'Lyft',                  sector:'Industry' },
  { token:'uber',                 name:'Uber',                  sector:'Industry' },
  { token:'airbnb',               name:'Airbnb',                sector:'Industry' },
  { token:'netflix',              name:'Netflix',               sector:'Industry' },
  { token:'samsara',              name:'Samsara',               sector:'Industry' },
  { token:'flexport',             name:'Flexport',              sector:'Industry' },
  { token:'doordashusa',          name:'DoorDash',              sector:'Industry' },
  { token:'flagshippioneeringinc',name:'Flagship Pioneering',   sector:'Industry' },
  { token:'wehrtyou',             name:'Hudson River Trading',  sector:'Finance'  },
  { token:'jumptrading',          name:'Jump Trading',          sector:'Finance'  },
  { token:'point72',              name:'Point72 / Cubist',      sector:'Finance'  },
  { token:'schonfeld',            name:'Schonfeld',             sector:'Finance'  },
  { token:'imc',                  name:'IMC Trading',           sector:'Finance'  },
  { token:'optiverneurips',       name:'Optiver',               sector:'Finance'  },
  { token:'robinhood',            name:'Robinhood',             sector:'Finance'  },
];

const LEVER = [
  { token:'allenai',    name:'Allen Institute for AI', sector:'Research Lab' },
  { token:'shield-ai',  name:'Shield AI',              sector:'Industry'     },
  { token:'recursion',  name:'Recursion',              sector:'Industry'     },
  { token:'plaid',      name:'Plaid',                  sector:'Finance'      },
  { token:'brex',       name:'Brex',                   sector:'Finance'      },
  { token:'benchling',  name:'Benchling',              sector:'Industry'     },
  { token:'insitro',    name:'Insitro',                sector:'Industry'     },
];

const ASHBY = [
  { token:'sandboxaq',            name:'SandboxAQ',        sector:'Industry' },
  { token:'suno',                 name:'Suno AI',          sector:'Industry' },
  { token:'mistral',              name:'Mistral AI',       sector:'Industry' },
  { token:'perplexity-ai',        name:'Perplexity AI',    sector:'Industry' },
  { token:'x-ai',                 name:'xAI',              sector:'Industry' },
  { token:'voleon',               name:'Voleon',           sector:'Finance'  },
  { token:'five-rings',           name:'Five Rings',       sector:'Finance'  },
  { token:'trexquant',            name:'Trexquant',        sector:'Finance'  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query   = searchParams.get('q') || 'machine learning scientist';
  const kwParam = searchParams.get('kw');
  const stream  = searchParams.get('stream') === '1';
  const warmup  = searchParams.get('warmup') === '1';

  // Warmup: just return cache status
  if (warmup) {
    return Response.json({ cached: cache.size, keys: [...cache.keys()] });
  }

  const cacheKey = query + (kwParam || '');
  const cached   = getCached(cacheKey);

  // Streaming mode
  if (stream) {
    if (cached) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          const send = obj => controller.enqueue(encoder.encode('data: ' + JSON.stringify(obj) + '\n\n'));
          cached.forEach(j => send({ type:'job', job:j }));
          send({ type:'done', total:cached.length, fromCache:true });
          controller.close();
        }
      });
      return new Response(readable, { headers:{ 'Content-Type':'text/event-stream','Cache-Control':'no-cache' } });
    }

    const keywords = kwParam ? JSON.parse(kwParam).map(k => k.toLowerCase()) : [query.toLowerCase()];
    const allJobs  = [];
    const seen     = new Set();
    const encoder  = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const send = obj => controller.enqueue(encoder.encode('data: ' + JSON.stringify(obj) + '\n\n'));

        const emit = (jobs) => {
          jobs.forEach(j => {
            if (!j.url || !j.title || seen.has(j.url)) return;
            seen.add(j.url);
            allJobs.push(j);
            send({ type:'job', job:j });
          });
        };

        // Fetch all sources, emit as each completes
        const sources = [
          fetchAllGreenhouse(keywords).then(emit),
          fetchAllLever(keywords).then(emit),
          fetchAllAshby(keywords).then(emit),
          fetchUSAJobs(query).then(emit),
        ];

        await Promise.allSettled(sources);

        if (allJobs.length > 0) setCached(cacheKey, allJobs);
        send({ type:'done', total:allJobs.length });
        controller.close();
      }
    });

    return new Response(readable, { headers:{ 'Content-Type':'text/event-stream','Cache-Control':'no-cache' } });
  }

  // Batch mode (fallback)
  if (cached) return Response.json({ jobs:cached, total:cached.length, fromCache:true });

  const keywords = kwParam ? JSON.parse(kwParam).map(k => k.toLowerCase()) : [query.toLowerCase()];
  const [ghR, lvR, abR, usaR] = await Promise.allSettled([
    fetchAllGreenhouse(keywords),
    fetchAllLever(keywords),
    fetchAllAshby(keywords),
    fetchUSAJobs(query),
  ]);

  const all  = [
    ...(ghR.status  === 'fulfilled' ? ghR.value  : []),
    ...(lvR.status  === 'fulfilled' ? lvR.value  : []),
    ...(abR.status  === 'fulfilled' ? abR.value  : []),
    ...(usaR.status === 'fulfilled' ? usaR.value : []),
  ];
  const seen = new Set();
  const jobs = all.filter(j => {
    if (!j.url || !j.title || seen.has(j.url)) return false;
    seen.add(j.url); return true;
  });

  if (jobs.length > 0) setCached(cacheKey, jobs);
  return Response.json({ jobs, total:jobs.length });
}

async function fetchAllGreenhouse(keywords) {
  const results = [];
  await Promise.all(GREENHOUSE.map(async co => {
    try {
      const res  = await fetch('https://boards-api.greenhouse.io/v1/boards/' + co.token + '/jobs', { signal:AbortSignal.timeout(8000) });
      if (!res.ok) return;
      const data = await res.json();
      const jobs = (data && data.jobs) ? data.jobs : [];
      jobs.forEach(j => {
        const title = (j.title || '').toLowerCase();
        if (!isPhDRole(title)) return;
        if (!matchesKeywords(title, keywords)) return;
        const loc = (j.location && j.location.name) ? j.location.name.toLowerCase() : '';
        const nonUS = ['london','uk','zürich','zurich','india','bangalore','singapore','canada','montreal','amsterdam','paris','berlin'];
        if (loc && nonUS.some(c => loc.includes(c))) return;
        results.push({
          id:'gh-'+j.id, title:j.title||'', org:co.name,
          location:(j.location&&j.location.name)||'See posting',
          domain:guessDomain(j.title||''), sector:co.sector,
          type:guessType(j.title||''), salary:null, deadline:'Rolling',
          url:j.absolute_url||('https://boards.greenhouse.io/'+co.token+'/jobs/'+j.id),
          source:'Greenhouse', desc:'', tags:extractTags(j.title||''),
          posted:j.updated_at?j.updated_at.slice(0,10):'', _source:'greenhouse',
        });
      });
    } catch {}
  }));
  return results;
}

async function fetchAllLever(keywords) {
  const results = [];
  await Promise.all(LEVER.map(async co => {
    try {
      const res  = await fetch('https://api.lever.co/v0/postings/' + co.token + '?mode=json', { signal:AbortSignal.timeout(8000) });
      if (!res.ok) return;
      const jobs = await res.json();
      if (!Array.isArray(jobs)) return;
      jobs.forEach(j => {
        const title = (j.text || '').toLowerCase();
        if (!isPhDRole(title)) return;
        if (!matchesKeywords(title, keywords)) return;
        const url = j.hostedUrl || j.applyUrl || '';
        if (!url) return;
        results.push({
          id:'lv-'+j.id, title:j.text||'', org:co.name,
          location:(j.categories&&j.categories.location)||'See posting',
          domain:guessDomain(j.text||''), sector:co.sector,
          type:guessType(j.text||''), salary:null, deadline:'Rolling',
          url, source:'Lever', desc:'', tags:extractTags(j.text||''),
          posted:j.createdAt?new Date(j.createdAt).toISOString().slice(0,10):'', _source:'lever',
        });
      });
    } catch {}
  }));
  return results;
}

async function fetchAllAshby(keywords) {
  const results = [];
  await Promise.all(ASHBY.map(async co => {
    try {
      const res  = await fetch('https://api.ashbyhq.com/posting-api/job-board/' + co.token, { signal:AbortSignal.timeout(8000) });
      if (!res.ok) return;
      const data = await res.json();
      const jobs = (data && data.jobs) ? data.jobs : [];
      jobs.forEach(j => {
        const title = (j.title || '').toLowerCase();
        if (!isPhDRole(title)) return;
        if (!matchesKeywords(title, keywords)) return;
        const country = (j.address&&j.address.postalAddress&&j.address.postalAddress.addressCountry||'').toLowerCase();
        if (country && country !== 'usa' && country !== 'us' && country !== 'united states') return;
        results.push({
          id:'ab-'+j.id, title:j.title||'', org:co.name,
          location:j.location||'USA',
          domain:guessDomain(j.title||''), sector:co.sector,
          type:guessType(j.title||''),
          salary:(j.compensation&&j.compensation.scrapeableCompensationSalarySummary)||null,
          deadline:'Rolling',
          url:j.jobUrl||j.applyUrl||'',
          source:'Ashby', desc:'', tags:extractTags(j.title||''),
          posted:j.publishedAt?j.publishedAt.slice(0,10):'', _source:'ashby',
        });
      });
    } catch {}
  }));
  return results;
}

async function fetchUSAJobs(query) {
  const keyword = query.replace(/["'()]/g,'').trim().slice(0,80);
  const url = 'https://data.usajobs.gov/api/search?Keyword='+encodeURIComponent(keyword)+'&ResultsPerPage=15&SortField=OpenDate&SortDirection=Desc&LocationName=United+States&Radius=0';
  const headers = { 'Host':'data.usajobs.gov','User-Agent':'phd-job-board/1.0' };
  if (process.env.USAJOBS_API_KEY) headers['Authorization-Key'] = process.env.USAJOBS_API_KEY;
  try {
    const res  = await fetch(url, { headers, signal:AbortSignal.timeout(8000) });
    const data = await res.json();
    if (!res.ok) return [];
    const items = (data&&data.SearchResult&&data.SearchResult.SearchResultItems)||[];
    return items.map(item => {
      const p      = item.MatchedObjectDescriptor;
      const pay    = p&&p.RemunPay&&p.RemunPay[0];
      const locObj = p&&p.PositionLocation&&p.PositionLocation[0];
      const summary= (p&&p.UserArea&&p.UserArea.Details&&p.UserArea.Details.JobSummary)||'';
      return {
        id:'usa-'+String((p&&p.PositionID)||''),
        title:(p&&p.PositionTitle)||'',
        org:(p&&(p.OrganizationName||p.DepartmentName))||'U.S. Agency',
        location:locObj?(locObj.CityName+', '+locObj.StateCode):'USA',
        domain:guessDomain(((p&&p.PositionTitle)||'')+' '+summary),
        sector:'Government',
        type:/intern|co-op|student trainee/i.test((p&&p.PositionTitle)||'')?'Internship':'Full-Time',
        salary:pay?('$'+Math.round(pay.MinimumRange/1000)+'k – $'+Math.round(pay.MaximumRange/1000)+'k'):null,
        deadline:(p&&p.ApplicationCloseDate&&p.ApplicationCloseDate.slice(0,10))||'Open',
        url:(p&&p.ApplyURI&&p.ApplyURI[0])||(p&&p.PositionURI)||'',
        source:'USAJobs.gov', desc:summary.slice(0,200), tags:extractTags(((p&&p.PositionTitle)||'')+' '+summary),
        posted:(p&&p.PublicationStartDate&&p.PublicationStartDate.slice(0,10))||'', _source:'usajobs',
      };
    }).filter(j => j.url && j.title);
  } catch { return []; }
}

function matchesKeywords(title, keywords) {
  return keywords.some(phrase => {
    const words = phrase.toLowerCase().split(' ').filter(w => w.length > 2);
    return words.every(w => title.includes(w));
  });
}

function isPhDRole(title) {
  title = (title||'').toLowerCase();
  if (/\b(senior|sr\.|lead|manager|director|head of|vp |vice president|chief)\b/.test(title)) return false;
  if (/\b(biolog|biochem|chemist(?!ry scientist)|genomic|protein|molecul|clinical|medical|pharma|drug discover|wet lab|neuroscien)\b/.test(title)) return false;
  if (/\b(software engineer|backend|frontend|devops|sre|site reliability|data engineer|product manager|designer|recruiter|sales|marketing|legal|accountant)\b/.test(title)) return false;
  const allowed = [
    'operations research','or scientist','or engineer','optimization scientist','optimization engineer','optimization researcher','decision scientist',
    'machine learning scientist','ml scientist','machine learning engineer','ml engineer','machine learning research','ml research',
    'deep learning scientist','deep learning researcher','ai research scientist','ai scientist',
    'reinforcement learning researcher','reinforcement learning scientist','rl researcher','rl scientist',
    'nlp scientist','nlp researcher','nlp engineer','natural language processing scientist',
    'research scientist','applied scientist','applied research scientist','research engineer',
    'quantitative researcher','quant researcher','quantitative scientist','quantitative analyst',
    'staff data scientist','principal data scientist','research data scientist','data scientist phd',
    'research intern','phd intern','quant intern','machine learning intern','ml intern','ai intern',
    'operations research intern','optimization intern','quantitative research intern','quant research intern',
    'postdoc','research fellow','economist','statistician',
  ];
  return allowed.some(p => title.includes(p));
}

function scoreJob(j, keywords) {
  const title = (j.title||'').toLowerCase();
  let score = 0;
  keywords.forEach(phrase => {
    if (title.includes(phrase.toLowerCase())) score += 10;
    else {
      const words = phrase.toLowerCase().split(' ').filter(w => w.length > 2);
      score += words.filter(w => title.includes(w)).length * 2;
    }
  });
  return score;
}

function guessDomain(t) {
  t=(t||'').toLowerCase();
  if (/reinforcement|\brl\b/.test(t))                                     return 'RL';
  if (/\bnlp\b|natural language|language model|\bllm\b/.test(t))          return 'NLP';
  if (/optim|integer program|stochastic|linear program|combinat/.test(t)) return 'OR';
  if (/machine learning|\bml\b|deep learn|neural/.test(t))                return 'ML';
  if (/\bai\b|artificial intelligence/.test(t))                           return 'AI';
  if (/supply chain|logistics|routing|scheduling/.test(t))                return 'OR';
  if (/quant|finance|trading/.test(t))                                    return 'Quant';
  return 'Mixed';
}
function guessType(t) { return /intern|co-op|summer/i.test(t||'')?'Internship':'Full-Time'; }
function extractTags(t) {
  t=t||'';
  const kw=['Python','PyTorch','TensorFlow','Gurobi','optimization','stochastic','reinforcement learning','deep learning','NLP','LLM','integer programming','supply chain','scheduling','PhD','machine learning','statistics'];
  return kw.filter(k=>new RegExp('\\b'+k+'\\b','i').test(t)).slice(0,4);
}
