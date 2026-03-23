'use client';
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

const S = {
  bg:'#0e0f11', surface:'#16181c', surface2:'#1c1f24',
  border:'#252830', border2:'#2e3340',
  blue:'#4f8ef7', blueDim:'#3b7de8',
  cyan:'#22d3ee', green:'#34d399', amber:'#fbbf24',
  purple:'#a78bfa', pink:'#f472b6',
  text:'#e8eaf0', muted:'#5a6072', dim:'#8892a4',
};

const CATEGORIES = [
  { id:'or-ft',     label:'OR Scientist / Engineer',    color:'#4f8ef7', bg:'rgba(79,142,247,.15)',  border:'rgba(79,142,247,.3)',  query:'operations research scientist optimization engineer', keywords:['operations research scientist','operations research engineer','operations research analyst','optimization scientist','optimization engineer','optimization researcher','decision scientist'] },
  { id:'or-int',    label:'OR PhD Internship',          color:'#4f8ef7', bg:'rgba(79,142,247,.1)',   border:'rgba(79,142,247,.2)',  query:'operations research intern phd', keywords:['operations research intern','optimization intern','industrial engineering intern','or intern'] },
  { id:'ml-sci',    label:'ML Research Scientist',      color:'#22d3ee', bg:'rgba(34,211,238,.15)',  border:'rgba(34,211,238,.3)',  query:'machine learning research scientist', keywords:['machine learning research scientist','ml research scientist','machine learning scientist','research scientist, machine learning','research scientist machine learning'] },
  { id:'ml-eng',    label:'ML Research Engineer',       color:'#22d3ee', bg:'rgba(34,211,238,.1)',   border:'rgba(34,211,238,.2)',  query:'machine learning research engineer', keywords:['machine learning research engineer','research engineer, machine learning','ml research engineer'] },
  { id:'ml-int',    label:'ML PhD Internship',          color:'#22d3ee', bg:'rgba(34,211,238,.08)',  border:'rgba(34,211,238,.15)', query:'machine learning phd intern', keywords:['machine learning phd intern','machine learning research intern','ml research intern','ml phd intern'] },
  { id:'ai-sci',    label:'AI Research Scientist',      color:'#34d399', bg:'rgba(52,211,153,.15)',  border:'rgba(52,211,153,.3)',  query:'artificial intelligence research scientist', keywords:['ai research scientist','artificial intelligence research scientist','deep learning scientist','deep learning researcher'] },
  { id:'rl',        label:'Reinforcement Learning',     color:'#a78bfa', bg:'rgba(167,139,250,.15)', border:'rgba(167,139,250,.3)', query:'reinforcement learning researcher', keywords:['reinforcement learning researcher','reinforcement learning scientist','rl researcher','rl scientist'] },
  { id:'nlp',       label:'NLP / LLM Scientist',        color:'#f472b6', bg:'rgba(244,114,182,.15)', border:'rgba(244,114,182,.3)', query:'nlp scientist researcher', keywords:['nlp scientist','nlp researcher','natural language processing scientist','llm researcher','llm scientist'] },
  { id:'quant-ft',  label:'Quantitative Researcher',    color:'#fbbf24', bg:'rgba(251,191,36,.15)',  border:'rgba(251,191,36,.3)',  query:'quantitative researcher', keywords:['quantitative researcher','quant researcher','quantitative research scientist','quantitative scientist','quantitative analyst'] },
  { id:'quant-int', label:'Quant PhD Internship',       color:'#fbbf24', bg:'rgba(251,191,36,.1)',   border:'rgba(251,191,36,.2)',  query:'quantitative research intern phd', keywords:['quantitative research intern','quant research intern','quant intern','quantitative phd intern'] },
  { id:'applied',   label:'Applied Scientist',          color:'#4f8ef7', bg:'rgba(79,142,247,.15)',  border:'rgba(79,142,247,.3)',  query:'applied scientist', keywords:['applied scientist','applied research scientist','applied ml scientist','applied ai scientist'] },
  { id:'data-sci',  label:'Data Scientist (Research)',  color:'#22d3ee', bg:'rgba(34,211,238,.15)',  border:'rgba(34,211,238,.3)',  query:'data scientist research phd', keywords:['staff data scientist','principal data scientist','research data scientist','data scientist phd'] },
];

const DIRECTORY = [
  // ─── BIG TECH ──────────────────────────────────────────────────────────────
  { name:'Google',                sector:'Big Tech',       hq:'Mountain View, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Jan-Mar',    ftInterview:'Mar-May',  ftStart:'Sep',      intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'May', url:'https://careers.google.com/jobs/results/?q=research+scientist',                                                    visa:true,  notes:'Strong PhD program. NeurIPS booth every year.' },
  { name:'Google DeepMind',       sector:'Big Tech',       hq:'London / NYC',       roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'May', url:'https://deepmind.google/careers/jobs/',                                                                             visa:true,  notes:'Most competitive AI lab. Publication record essential.' },
  { name:'Meta AI (FAIR)',        sector:'Big Tech',       hq:'Menlo Park, CA',     roles:['Research Scientist','Research Engineer'],            ftOpen:'Jan-Mar',    ftInterview:'Mar-May',  ftStart:'Sep',      intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'May', url:'https://www.metacareers.com/jobs/?teams[0]=Artificial%20Intelligence',                                              visa:true,  notes:'FAIR is Meta\'s fundamental AI research division.' },
  { name:'Microsoft Research',    sector:'Big Tech',       hq:'Redmond, WA',        roles:['Researcher','Senior Researcher'],                    ftOpen:'Nov-Feb',    ftInterview:'Feb-Apr',  ftStart:'Sep',      intOpen:'Oct-Dec',   intInterview:'Dec-Feb',  intStart:'May', url:'https://careers.microsoft.com/us/en/search-results?keywords=researcher',                                            visa:true,  notes:'Each MSR lab hires independently. Cold email works.' },
  { name:'Amazon Science',        sector:'Big Tech',       hq:'Seattle, WA',        roles:['Applied Scientist','Research Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'May', url:'https://www.amazon.jobs/en/search?base_query=research+scientist',                                                   visa:true,  notes:'Bar raiser final round. Multiple science teams.' },
  { name:'Apple',                 sector:'Big Tech',       hq:'Cupertino, CA',      roles:['ML Research Scientist','Research Engineer'],         ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.apple.com/en-us/search?search=research+scientist',                                                     visa:true,  notes:'Referral-heavy. Conference recruiting is key.' },
  { name:'NVIDIA',                sector:'Semiconductor',  hq:'Santa Clara, CA',    roles:['Research Scientist','Deep Learning Researcher'],     ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.nvidia.com/en-us/about-nvidia/careers/',                                                                visa:true,  notes:'GPU + ML research. Strong DL team.' },
  { name:'IBM Research',          sector:'Big Tech',       hq:'Yorktown Heights, NY',roles:['Research Scientist','Research Staff Member'],       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.ibm.com/careers/us-en/search/?filters=department:Research',                                             visa:true,  notes:'Multiple US research labs. AI and OR research.' },
  { name:'Salesforce AI Research',sector:'Big Tech',       hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.salesforce.com/en/jobs/?search=research+scientist',                                                 visa:true,  notes:'Einstein AI team. NLP and ML focus.' },
  { name:'Adobe Research',        sector:'Big Tech',       hq:'San Jose, CA',       roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://research.adobe.com/careers/',                                                                               visa:true,  notes:'Computer vision and generative AI focus.' },
  { name:'Snap Research',         sector:'Big Tech',       hq:'Santa Monica, CA',   roles:['Research Scientist'],                                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Dec',   intInterview:'Dec-Feb',  intStart:'May', url:'https://careers.snap.com/roles?category=Engineering',                                                               visa:true,  notes:'AR/VR and ML research.' },
  { name:'Twitter / X',           sector:'Big Tech',       hq:'San Francisco, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.x.com/',                                                                                            visa:true,  notes:'Recommendation systems and NLP research.' },
  { name:'LinkedIn',              sector:'Big Tech',       hq:'Sunnyvale, CA',      roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.linkedin.com/jobs/search?keywords=research+scientist',                                              visa:true,  notes:'Economic graph and recsys research.' },
  { name:'Pinterest',             sector:'Big Tech',       hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.pinterestcareers.com/jobs/?q=research+scientist',                                                       visa:true,  notes:'Vision and recommendation research.' },
  // ─── AI LABS ───────────────────────────────────────────────────────────────
  { name:'Anthropic',             sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.anthropic.com/careers',                                                                                 visa:true,  notes:'Fast process ~3 weeks. Values interview matters.' },
  { name:'OpenAI',                sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Dec',   intInterview:'Dec-Feb',  intStart:'May', url:'https://openai.com/careers',                                                                                        visa:true,  notes:'Most competitive. Strong pubs required.' },
  { name:'xAI',                   sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist'],                                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Year-round',intInterview:'Rolling',  intStart:'Rolling',url:'https://x.ai/careers',                                                                                             visa:true,  notes:'Fast-growing. Small team, high impact.' },
  { name:'Mistral AI',            sector:'AI Lab',         hq:'Paris / SF',         roles:['Research Scientist'],                                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Year-round',intInterview:'Rolling',  intStart:'Rolling',url:'https://mistral.ai/careers',                                                                                       visa:true,  notes:'EU-based but US-friendly. LLM research.' },
  { name:'Cohere',                sector:'AI Lab',         hq:'Toronto / SF',       roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://cohere.com/careers',                                                                                        visa:true,  notes:'Enterprise LLM. Strong NLP team.' },
  { name:'Perplexity AI',         sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist'],                                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Year-round',intInterview:'Rolling',  intStart:'Rolling',url:'https://www.perplexity.ai/hub/careers',                                                                             visa:true,  notes:'Search + reasoning research. Small team.' },
  { name:'Scale AI',              sector:'AI Lab',         hq:'San Francisco, CA',  roles:['ML Research Scientist','Research Engineer'],         ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://scale.com/careers',                                                                                         visa:true,  notes:'Post-training and RLHF research focus.' },
  { name:'Allen Institute for AI',sector:'Research Lab',   hq:'Seattle, WA',        roles:['Research Scientist','Predoctoral Researcher'],       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.lever.co/allenai',                                                                                     visa:true,  notes:'Non-profit. NLP and vision. Strong mentorship.' },
  { name:'Toyota Research Institute',sector:'Research Lab',hq:'Los Altos, CA',      roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.tri.global/',                                                                                          visa:true,  notes:'Robotics, autonomy, ML for science.' },
  { name:'Bosch Research',        sector:'Research Lab',   hq:'Sunnyvale, CA',      roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.bosch.us/our-company/bosch-in-the-usa/research/',                                                       visa:true,  notes:'Computer vision, autonomy, AI safety.' },
  { name:'Samsung AI Research',   sector:'Research Lab',   hq:'Mountain View, CA',  roles:['Research Scientist'],                                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://samsungresearchamerica.applytojob.com/',                                                                     visa:true,  notes:'Vision and on-device AI.' },
  { name:'Qualcomm AI Research',  sector:'Semiconductor',  hq:'San Diego, CA',      roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.qualcomm.com/company/careers',                                                                          visa:true,  notes:'On-device ML and efficient inference.' },
  // ─── INDUSTRY / OR ─────────────────────────────────────────────────────────
  { name:'Waymo',                 sector:'Industry / OR',  hq:'Mountain View, CA',  roles:['Research Scientist','Perception Engineer'],          ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://waymo.com/careers/',                                                                                        visa:true,  notes:'Autonomous driving. Perception, planning, sim.' },
  { name:'DoorDash',              sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['OR Scientist','Applied Scientist'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.doordash.com/jobs?q=operations+research',                                                           visa:true,  notes:'Strong OR team. Dispatch and routing optimization.' },
  { name:'Lyft',                  sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.lyft.com/careers/research',                                                                             visa:true,  notes:'Marketplace pricing and matching.' },
  { name:'Uber',                  sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.uber.com/us/en/careers/teams/ai/',                                                                      visa:true,  notes:'Uber AI — marketplace optimization.' },
  { name:'Airbnb',                sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.airbnb.com/positions/?department=Data+Science',                                                     visa:true,  notes:'Pricing and search ranking research.' },
  { name:'Instacart',             sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://instacart.careers/current-openings/',                                                                       visa:true,  notes:'Supply chain and fulfillment optimization.' },
  { name:'Flexport',              sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.flexport.com/careers/',                                                                                 visa:true,  notes:'Global freight logistics optimization.' },
  { name:'Samsara',               sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.samsara.com/company/careers',                                                                           visa:true,  notes:'Fleet and operations optimization.' },
  { name:'Palantir',              sector:'Industry / OR',  hq:'Denver, CO',         roles:['Research Scientist','Forward Deployed Engineer'],   ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.palantir.com/careers/',                                                                                 visa:false, notes:'Decomposition interview is unique. Strong mission.' },
  { name:'Databricks',            sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.databricks.com/company/careers/open-positions',                                                         visa:true,  notes:'Distributed ML. Strong MLflow and LLM team.' },
  { name:'Stripe',                sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://stripe.com/jobs/search?q=scientist',                                                                        visa:true,  notes:'Fraud detection and payment ML.' },
  { name:'Spotify',               sector:'Industry / OR',  hq:'New York, NY',       roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.lifeatspotify.com/jobs?q=research+scientist',                                                           visa:true,  notes:'Recommendation, audio ML, and NLP.' },
  { name:'Netflix',               sector:'Industry / OR',  hq:'Los Gatos, CA',      roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.netflix.com/search?q=research+scientist',                                                              visa:true,  notes:'Recommendation systems and personalization.' },
  { name:'Dropbox',               sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.dropbox.com/teams/engineering',                                                                        visa:true,  notes:'ML for storage, sync and collaboration.' },
  { name:'Figma',                 sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.figma.com/careers/',                                                                                    visa:true,  notes:'ML for design tools.' },
  { name:'Zoom',                  sector:'Industry / OR',  hq:'San Jose, CA',       roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.zoom.us/jobs?q=research',                                                                           visa:true,  notes:'Audio/video ML, NLP for meetings.' },
  { name:'Twilio',                sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.twilio.com/en-us/company/jobs',                                                                         visa:true,  notes:'Communications ML and NLP.' },
  { name:'Cloudflare',            sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.cloudflare.com/careers/jobs/',                                                                          visa:true,  notes:'Network optimization and security ML.' },
  // ─── QUANT FINANCE ─────────────────────────────────────────────────────────
  { name:'Jane Street',           sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Software Engineer'],       ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul-Aug',  intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://www.janestreet.com/join-jane-street/open-roles/',                                                           visa:true,  notes:'Multi-day on-site. Probability and market-making.' },
  { name:'Two Sigma',             sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Aug-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.twosigma.com/careers/',                                                                                 visa:true,  notes:'Research-heavy. ML + stats depth. 4-8 weeks.' },
  { name:'Citadel',               sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://www.citadel.com/careers/',                                                                                  visa:true,  notes:'Very fast process (1-2 weeks). Securities is separate.' },
  { name:'Citadel Securities',    sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Quant Trader'],            ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://www.citadelsecurities.com/careers/',                                                                        visa:true,  notes:'Market making focus. Separate from Citadel.' },
  { name:'Hudson River Trading',  sector:'Quant Finance',  hq:'New York, NY',       roles:['Algorithm Developer','Research Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.hudsonrivertrading.com/careers/',                                                                       visa:true,  notes:'C++/Python coding-heavy. CS + quant combo.' },
  { name:'D.E. Shaw',             sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Analyst','Computational Scientist'],    ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Aug-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.deshaw.com/careers/',                                                                                   visa:true,  notes:'Thorough multi-round. Prob, CS, research.' },
  { name:'IMC Trading',           sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Trader'],                  ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul',      intOpen:'Aug-Oct',   intInterview:'Oct-Nov',  intStart:'Jun', url:'https://www.imc.com/us/careers/',                                                                                   visa:true,  notes:'Trading simulation round. Math and intuition.' },
  { name:'Optiver',               sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Trader'],                  ftOpen:'Sep-Nov',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://optiver.com/working-at-optiver/career-opportunities/',                                                      visa:true,  notes:'80-in-8 mental math first filter.' },
  { name:'Point72',               sector:'Quant Finance',  hq:'Stamford, CT',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://careers.point72.com/',                                                                                      visa:true,  notes:'Cubist (systematic) is most PhD-relevant.' },
  { name:'Schonfeld',             sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.schonfeld.com/careers/',                                                                                visa:true,  notes:'Collaborative culture. ML background valued.' },
  { name:'AQR Capital',           sector:'Quant Finance',  hq:'Greenwich, CT',      roles:['Quantitative Researcher','Economist'],               ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://careers.aqr.com/jobs#/',                                                                                    visa:true,  notes:'Factor investing. Strong stats background.' },
  { name:'Renaissance Technologies',sector:'Quant Finance',hq:'East Setauket, NY',  roles:['Researcher','Computational Scientist'],              ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://careers.rentec.com/',                                                                                       visa:false, notes:'Most selective. PhD math/physics/CS. No interns.' },
  { name:'Bridgewater',           sector:'Hedge Fund',     hq:'Westport, CT',       roles:['Investment Associate','Researcher'],                 ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.bridgewater.com/about-bridgewater/career-opportunities',                                                visa:false, notes:'Macro focus. Unique culture interview.' },
  { name:'Jump Trading',          sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Research Scientist'],      ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://www.jumptrading.com/careers/',                                                                              visa:true,  notes:'Problem sets in advance. Prob + algorithms.' },
  { name:'Five Rings',            sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Software Developer'],      ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://fiverings.com/careers/',                                                                                    visa:true,  notes:'Small selective firm. Math and CS heavy.' },
  { name:'Voleon',                sector:'Hedge Fund',     hq:'Berkeley, CA',       roles:['Quantitative Researcher','Research Scientist'],      ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://voleon.com/careers.html',                                                                                   visa:true,  notes:'ML-focused quant fund. PhD research valued.' },
  { name:'Millennium Management', sector:'Hedge Fund',     hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.mlp.com/careers/',                                                                                      visa:true,  notes:'Multi-manager pod structure.' },
  { name:'Balyasny Asset Mgmt',   sector:'Hedge Fund',     hq:'Chicago, IL',        roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.bamfunds.com/careers',                                                                                  visa:true,  notes:'Multi-manager. Data science and quant research.' },
  { name:'Man Group / Man AHL',   sector:'Hedge Fund',     hq:'New York / London',  roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.man.com/careers',                                                                                       visa:true,  notes:'Systematic trading. ML research focused.' },
  { name:'Winton Group',          sector:'Hedge Fund',     hq:'London / New York',  roles:['Researcher','Data Scientist'],                       ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.winton.com/careers',                                                                                    visa:true,  notes:'Systematic, research-driven fund.' },
  { name:'WorldQuant',            sector:'Hedge Fund',     hq:'Old Greenwich, CT',  roles:['Quantitative Researcher','Research Consultant'],     ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Year-round',intInterview:'Rolling',  intStart:'Rolling',url:'https://www.worldquant.com/career-listing/',                                                                      visa:true,  notes:'Remote-friendly. Alpha research focus.' },
  { name:'Squarepoint Capital',   sector:'Hedge Fund',     hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.squarepoint-capital.com/careers',                                                                      visa:true,  notes:'Systematic, quantitative fund.' },
  { name:'Qube Research & Tech',  sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher'],                           ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.qube-rt.com/careers/',                                                                                  visa:true,  notes:'European quant firm expanding to US.' },
  { name:'Susquehanna (SIG)',     sector:'Quant Finance',  hq:'Bala Cynwyd, PA',    roles:['Quantitative Researcher','Quant Trader'],            ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://sig.com/careers/',                                                                                          visa:true,  notes:'Trading and market making. Math-heavy.' },
  { name:'Akuna Capital',         sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Quant Developer'],         ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://akunacapital.com/careers',                                                                                  visa:true,  notes:'Options trading. Python and math focus.' },
  { name:'Virtu Financial',       sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.virtu.com/careers/',                                                                                    visa:true,  notes:'High-frequency trading firm.' },
  { name:'Trexquant',             sector:'Hedge Fund',     hq:'Stamford, CT',       roles:['Quantitative Researcher'],                           ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://trexquant.com/careers/',                                                                                    visa:true,  notes:'Small quant fund. ML and stats focused.' },
  // ─── CONSULTING ────────────────────────────────────────────────────────────
  { name:'McKinsey QuantumBlack', sector:'Consulting',     hq:'New York, NY',       roles:['Data Scientist','ML Engineer'],                      ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Sep',      intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.mckinsey.com/careers/search-jobs#?query=quantumblack',                                                  visa:true,  notes:'Case + data science technical. ML engineering.' },
  { name:'BCG GAMMA',             sector:'Consulting',     hq:'Boston, MA',         roles:['Data Scientist','ML Engineer'],                      ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Sep',      intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://careers.bcg.com/gamma',                                                                                      visa:true,  notes:'AI/ML consulting arm of BCG.' },
  { name:'Bain & Company',        sector:'Consulting',     hq:'Boston, MA',         roles:['Advanced Analytics Associate'],                      ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Sep',      intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.bain.com/careers/',                                                                                      visa:true,  notes:'Advanced Analytics and AI group.' },
  { name:'Accenture Applied Intelligence',sector:'Consulting',hq:'New York, NY',    roles:['Data Scientist','AI Researcher'],                    ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.accenture.com/us-en/careers/jobsearch?jk=data+scientist+phd',                                           visa:true,  notes:'Large-scale ML and OR deployment.' },
  { name:'Deloitte AI',           sector:'Consulting',     hq:'New York, NY',       roles:['Data Scientist','AI Researcher'],                    ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://apply.deloitte.com/careers/SearchJobs/data+scientist',                                                      visa:true,  notes:'AI strategy and implementation.' },
  // ─── HEALTHCARE / BIOTECH ──────────────────────────────────────────────────
  { name:'Recursion',             sector:'Biotech / AI',   hq:'Salt Lake City, UT', roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.recursion.com/careers',                                                                                 visa:true,  notes:'AI for drug discovery. Biology + ML.' },
  { name:'Insitro',               sector:'Biotech / AI',   hq:'San Francisco, CA',  roles:['Research Scientist','ML Scientist'],                 ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://insitro.com/careers/',                                                                                      visa:true,  notes:'ML for drug development. Daphne Koller\'s company.' },
  { name:'Generate Biomedicines', sector:'Biotech / AI',   hq:'Cambridge, MA',      roles:['Research Scientist','Computational Biologist'],      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://generatebiomedicines.com/careers',                                                                          visa:true,  notes:'Generative AI for protein design.' },
  { name:'Tempus AI',             sector:'Healthcare AI',  hq:'Chicago, IL',        roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.tempus.com/careers/',                                                                                   visa:true,  notes:'AI for precision medicine.' },
  { name:'Flatiron Health',       sector:'Healthcare AI',  hq:'New York, NY',       roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://flatiron.com/careers/',                                                                                     visa:true,  notes:'Oncology data and ML. Roche subsidiary.' },
  { name:'PathAI',                sector:'Healthcare AI',  hq:'Boston, MA',         roles:['Research Scientist','ML Scientist'],                 ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.pathai.com/careers/',                                                                                   visa:true,  notes:'AI for pathology. Strong CV focus.' },
  { name:'Verily',                sector:'Healthcare AI',  hq:'South San Francisco',roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://verily.com/about-us/careers/',                                                                              visa:true,  notes:'Alphabet life sciences. ML + OR for health.' },
  { name:'Nuvation Bio',          sector:'Biotech / AI',   hq:'New York, NY',       roles:['Computational Scientist','ML Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.nuvationbio.com/careers/',                                                                              visa:true,  notes:'Oncology. Computational drug design.' },
  // ─── ENERGY / OR ───────────────────────────────────────────────────────────
  { name:'National Grid',         sector:'Energy / OR',    hq:'Waltham, MA',        roles:['OR Scientist','Data Scientist'],                     ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.nationalgrid.com/',                                                                                 visa:false, notes:'Grid optimization and energy forecasting.' },
  { name:'Pacific Gas & Electric',sector:'Energy / OR',    hq:'Oakland, CA',        roles:['OR Analyst','Data Scientist'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.pge.com/',                                                                                          visa:false, notes:'Energy optimization and grid management.' },
  { name:'Exelon',                sector:'Energy / OR',    hq:'Chicago, IL',        roles:['OR Analyst','Data Scientist'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.exeloncorp.com/',                                                                                      visa:false, notes:'Nuclear and electric utility optimization.' },
  { name:'GE Research',           sector:'Energy / OR',    hq:'Niskayuna, NY',      roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.gecareers.com/global/en/ge-research',                                                                  visa:true,  notes:'Industrial AI and optimization.' },
  { name:'ExxonMobil Research',   sector:'Energy / OR',    hq:'Spring, TX',         roles:['Research Scientist','OR Scientist'],                 ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.exxonmobil.com/',                                                                                      visa:false, notes:'Energy optimization and computational research.' },
  { name:'Tesla',                 sector:'Industry / OR',  hq:'Austin, TX',         roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.tesla.com/careers/search#/?department=6',                                                               visa:true,  notes:'Autopilot, Dojo, and energy optimization.' },
  { name:'Aurora Innovation',     sector:'Industry / OR',  hq:'Pittsburgh, PA',     roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://aurora.tech/careers',                                                                                       visa:true,  notes:'Self-driving trucks. Perception and planning.' },
  { name:'Cruise',                sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://getcruise.com/careers/',                                                                                    visa:true,  notes:'Autonomous vehicles. GM subsidiary.' },
  // ─── DEFENSE / AEROSPACE ───────────────────────────────────────────────────
  { name:'Shield AI',             sector:'Defense',        hq:'San Diego, CA',      roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://shield.ai/careers/',                                                                                        visa:false, notes:'AI for national security. US citizenship likely req.' },
  { name:'Rebellion Defense',     sector:'Defense',        hq:'Washington, DC',     roles:['ML Research Scientist','Data Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://rebelliondefense.com/careers',                                                                              visa:false, notes:'AI for defense. Clearance often required.' },
  { name:'Leidos',                sector:'Defense',        hq:'Reston, VA',         roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.leidos.com/jobs?q=research+scientist',                                                              visa:false, notes:'Defense and healthcare IT. OR and ML roles.' },
  { name:'Booz Allen Hamilton',   sector:'Defense',        hq:'McLean, VA',         roles:['Data Scientist','OR Analyst'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.boozallen.com/careers/find-a-job.html?q=data+scientist',                                                 visa:false, notes:'Defense analytics and ML. Clearance helpful.' },
  { name:'MITRE Corporation',     sector:'Defense',        hq:'McLean, VA',         roles:['Research Scientist','OR Analyst'],                   ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.mitre.org/',                                                                                        visa:false, notes:'FFRDC. Strong OR and AI research.' },
  { name:'SAIC',                  sector:'Defense',        hq:'Reston, VA',         roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.saic.com/jobs?q=data+scientist',                                                                       visa:false, notes:'Defense and government technology.' },
  // ─── NATIONAL LABS / GOVERNMENT ────────────────────────────────────────────
  { name:'Argonne National Lab',  sector:'Government',     hq:'Lemont, IL',         roles:['Postdoc','Research Scientist'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.anl.gov/careers',                                                                                       visa:true,  notes:'DOE lab. Strong OR and ML programs.' },
  { name:'Sandia National Labs',  sector:'Government',     hq:'Albuquerque, NM',    roles:['R&D Scientist','Postdoc'],                           ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.sandia.gov/',                                                                                          visa:false, notes:'US citizenship required for most roles.' },
  { name:'Oak Ridge National Lab',sector:'Government',     hq:'Oak Ridge, TN',      roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.ornl.gov/',                                                                                            visa:true,  notes:'Strong computing and data science division.' },
  { name:'Lawrence Berkeley Lab', sector:'Government',     hq:'Berkeley, CA',       roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.lbl.gov/',                                                                                             visa:true,  notes:'DOE lab. Computational science and ML.' },
  { name:'Los Alamos National Lab',sector:'Government',    hq:'Los Alamos, NM',     roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.lanl.gov/careers/',                                                                                     visa:false, notes:'US citizenship preferred. OR and ML groups.' },
  { name:'Lawrence Livermore Lab',sector:'Government',     hq:'Livermore, CA',      roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.llnl.gov/careers',                                                                                      visa:false, notes:'National security and scientific computing.' },
  { name:'Pacific Northwest Lab', sector:'Government',     hq:'Richland, WA',       roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.pnnl.gov/careers',                                                                                      visa:true,  notes:'Energy and environmental ML research.' },
  { name:'Brookhaven National Lab',sector:'Government',    hq:'Upton, NY',          roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.bnl.gov/hr/careers.php',                                                                                visa:true,  notes:'Physics and data science research.' },
  { name:'Ames Laboratory',       sector:'Government',     hq:'Ames, IA',           roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.ameslab.gov/careers',                                                                                   visa:true,  notes:'DOE lab. Materials science and computing.' },
  { name:'NIST',                  sector:'Government',     hq:'Gaithersburg, MD',   roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.nist.gov/careers',                                                                                      visa:true,  notes:'Standards and AI measurement research.' },
  { name:'NIH / NLM',             sector:'Government',     hq:'Bethesda, MD',       roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.nih.gov/',                                                                                             visa:true,  notes:'Biomedical data science and ML.' },
  { name:'RAND Corporation',      sector:'Government',     hq:'Santa Monica, CA',   roles:['OR Analyst','Research Scientist'],                   ftOpen:'Oct-Jan',    ftInterview:'Jan-Mar',  ftStart:'Sep',      intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.rand.org/jobs.html',                                                                                    visa:true,  notes:'Policy-focused OR. Writing sample required.' },
  { name:'CMS / USDS',            sector:'Government',     hq:'Washington, DC',     roles:['Data Scientist','OR Analyst'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.usds.gov/apply',                                                                                        visa:false, notes:'US Digital Service. Tech in government.' },
  { name:'MIT Lincoln Laboratory',sector:'Government',     hq:'Lexington, MA',      roles:['Research Scientist','Technical Staff'],              ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.ll.mit.edu/careers',                                                                                    visa:false, notes:'FFRDC. US citizenship required. ML and OR.' },
  { name:'Johns Hopkins APL',     sector:'Government',     hq:'Laurel, MD',         roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.jhuapl.edu/careers',                                                                                    visa:false, notes:'Defense research. OR and ML roles.' },
  // ─── SUPPLY CHAIN / RETAIL OR ──────────────────────────────────────────────
  { name:'Amazon (Supply Chain)', sector:'Logistics / OR', hq:'Seattle, WA',        roles:['Research Scientist','Operations Research Scientist'],ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'May', url:'https://www.amazon.jobs/en/search?base_query=operations+research',                                                  visa:true,  notes:'Largest OR team in industry. Multiple divisions.' },
  { name:'FedEx',                 sector:'Logistics / OR', hq:'Memphis, TN',        roles:['OR Analyst','Data Scientist'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.fedex.com/fedex/jobs?keywords=data+scientist',                                                      visa:false, notes:'Supply chain and routing optimization.' },
  { name:'UPS',                   sector:'Logistics / OR', hq:'Atlanta, GA',        roles:['OR Analyst','Data Scientist'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.jobs-ups.com/search-jobs?q=data+scientist',                                                             visa:false, notes:'ORION routing system. Strong OR tradition.' },
  { name:'Target',                sector:'Logistics / OR', hq:'Minneapolis, MN',    roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.target.com/search-jobs?q=data+scientist',                                                              visa:true,  notes:'Supply chain and inventory optimization.' },
  { name:'Walmart Labs',          sector:'Logistics / OR', hq:'Sunnyvale, CA',      roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.walmart.com/results?q=research+scientist',                                                          visa:true,  notes:'Supply chain and forecasting at massive scale.' },
  { name:'Best Buy',              sector:'Logistics / OR', hq:'Richfield, MN',      roles:['Data Scientist','OR Analyst'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.bestbuy.com/bby/jobs?keywords=data+scientist',                                                         visa:false, notes:'Inventory and supply chain optimization.' },
  { name:'Wayfair',               sector:'Logistics / OR', hq:'Boston, MA',         roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.wayfair.com/careers/jobs?q=research+scientist',                                                         visa:true,  notes:'Supply chain and pricing research.' },
  { name:'Coupang',               sector:'Logistics / OR', hq:'Seattle, WA',        roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.coupang.jobs/',                                                                                         visa:true,  notes:'Korean e-commerce. Strong OR team in US.' },
  // ─── FINANCE / ML ──────────────────────────────────────────────────────────
  { name:'Goldman Sachs',         sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Strategist','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://higher.gs.com/roles?q=quantitative',                                                                        visa:true,  notes:'Strats role is most PhD-relevant. Strong quant team.' },
  { name:'Morgan Stanley',        sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://morganstanley.com/people-opportunities/students-graduates',                                                 visa:true,  notes:'Algorithmic trading and risk research.' },
  { name:'JPMorgan AI Research',  sector:'Finance / ML',   hq:'New York, NY',       roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'Jun', url:'https://careers.jpmorgan.com/us/en/students/programs/quant-research-analyst',                                        visa:true,  notes:'JPMC AI research team. Growing fast.' },
  { name:'BlackRock',             sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://careers.blackrock.com/early-careers/students/?view=student',                                                visa:true,  notes:'Aladdin platform. Risk and portfolio optimization.' },
  { name:'Vanguard',              sector:'Finance / ML',   hq:'Malvern, PA',        roles:['Quantitative Analyst','Data Scientist'],             ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.vanguardjobs.com/search-jobs?q=quantitative',                                                           visa:false, notes:'Asset management. Portfolio optimization.' },
  { name:'Fidelity',              sector:'Finance / ML',   hq:'Boston, MA',         roles:['Quantitative Analyst','Data Scientist'],             ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://jobs.fidelity.com/search-results?q=quantitative',                                                          visa:false, notes:'Investment management. ML for finance.' },
  { name:'Numerai',               sector:'Hedge Fund',     hq:'San Francisco, CA',  roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://numer.ai/careers',                                                                                          visa:true,  notes:'Crowdsourced quant fund. ML research.' },
  // ─── ADDITIONAL INDUSTRY ───────────────────────────────────────────────────
  { name:'Cruise (GM)',           sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://getcruise.com/careers/',                                                                                    visa:true,  notes:'Autonomous vehicles. GM subsidiary.' },
  { name:'Aurora',                sector:'Industry / OR',  hq:'Pittsburgh, PA',     roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://aurora.tech/careers',                                                                                       visa:true,  notes:'Self-driving trucks. Planning and perception.' },
  { name:'Nuro',                  sector:'Industry / OR',  hq:'Mountain View, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.nuro.ai/careers',                                                                                       visa:true,  notes:'Autonomous delivery vehicles.' },
  { name:'Zoox',                  sector:'Industry / OR',  hq:'Foster City, CA',    roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://zoox.com/careers/',                                                                                         visa:true,  notes:'Autonomous robotaxi. Amazon subsidiary.' },
  { name:'Rivian',                sector:'Industry / OR',  hq:'Irvine, CA',         roles:['Data Scientist','ML Engineer'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://rivian.com/careers',                                                                                        visa:true,  notes:'EV. Supply chain and battery optimization.' },
  { name:'Lucid Motors',          sector:'Industry / OR',  hq:'Newark, CA',         roles:['Data Scientist','Research Engineer'],                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.lucidmotors.com/',                                                                                     visa:true,  notes:'EV company. Battery and powertrain ML.' },
  { name:'SpaceX',                sector:'Industry / OR',  hq:'Hawthorne, CA',      roles:['Data Scientist','Research Engineer'],                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.spacex.com/careers/',                                                                                   visa:false, notes:'Launch and satellite optimization. ITAR applies.' },
  { name:'Relativity Space',      sector:'Industry / OR',  hq:'Long Beach, CA',     roles:['Data Scientist','ML Engineer'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.relativityspace.com/careers',                                                                           visa:true,  notes:'3D printed rockets. Manufacturing optimization.' },
  { name:'Plaid',                 sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://plaid.com/careers/openings/',                                                                               visa:true,  notes:'Fintech infrastructure. Fraud and ML.' },
  { name:'Robinhood',             sector:'Finance / ML',   hq:'Menlo Park, CA',     roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.robinhood.com/',                                                                                    visa:true,  notes:'Retail trading. Fraud and risk ML.' },
  { name:'Brex',                  sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.brex.com/company/careers',                                                                              visa:true,  notes:'Corporate cards. Credit risk ML.' },
  { name:'Chime',                 sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Data Scientist','ML Engineer'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.chime.com/',                                                                                        visa:true,  notes:'Neobank. Fraud and credit risk.' },
  { name:'SandboxAQ',             sector:'AI Lab',         hq:'Palo Alto, CA',      roles:['Research Scientist','Quantum Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.sandboxaq.com/careers',                                                                                 visa:true,  notes:'Quantum + AI. Google Alphabet spin-off.' },
  { name:'IonQ',                  sector:'AI Lab',         hq:'College Park, MD',   roles:['Research Scientist','Quantum Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://ionq.com/careers',                                                                                          visa:true,  notes:'Quantum computing. QML research.' },
  { name:'Gauntlet',              sector:'Finance / ML',   hq:'New York, NY',       roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.gauntlet.xyz/careers',                                                                                  visa:true,  notes:'DeFi risk and optimization.' },
  { name:'Ramp',                  sector:'Finance / ML',   hq:'New York, NY',       roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://ramp.com/careers',                                                                                          visa:true,  notes:'Corporate spend. ML for finance.' },
  { name:'Lemonade',              sector:'Finance / ML',   hq:'New York, NY',       roles:['Data Scientist','ML Engineer'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://makers.lemonade.com/',                                                                                      visa:true,  notes:'Insurtech. Actuarial and risk ML.' },
  { name:'Hugging Face',          sector:'AI Lab',         hq:'New York, NY',       roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://apply.workable.com/huggingface/',                    visa:true,  notes:'Open-source AI hub. NLP and transformers.' },
  { name:'Stability AI',          sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://stability.ai/careers',                               visa:true,  notes:'Generative image and multimodal AI.' },
  { name:'Together AI',           sector:'AI Lab',         hq:'San Francisco, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.together.ai/careers',                            visa:true,  notes:'Open-source LLM training and inference.' },
  { name:'Character AI',          sector:'AI Lab',         hq:'Menlo Park, CA',     roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.character.ai/',                              visa:true,  notes:'Conversational AI. Fast-growing.' },
  { name:'Runway ML',             sector:'AI Lab',         hq:'New York, NY',       roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://runwayml.com/careers/',                              visa:true,  notes:'Generative video and creative AI.' },
  { name:'Groq',                  sector:'Semiconductor',  hq:'Mountain View, CA',  roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://groq.com/careers/',                                  visa:true,  notes:'LPU chip for fast LLM inference.' },
  { name:'Cerebras Systems',      sector:'Semiconductor',  hq:'Sunnyvale, CA',      roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://cerebras.net/careers/',                              visa:true,  notes:'Wafer-scale AI chip. Strong ML systems team.' },
  { name:'AMD',                   sector:'Semiconductor',  hq:'Santa Clara, CA',    roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.amd.com/careers-home/jobs?keywords=research+scientist', visa:true, notes:'GPU and AI accelerator research.' },
  { name:'Intel Labs',            sector:'Semiconductor',  hq:'Santa Clara, CA',    roles:['Research Scientist','Research Engineer'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.intel.com/en/search#q=research%20scientist',    visa:true,  notes:'Hardware + ML research.' },
  { name:'Pfizer Digital',        sector:'Healthcare AI',  hq:'New York, NY',       roles:['Data Scientist','ML Scientist'],                     ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.pfizer.com/about/careers',                       visa:true,  notes:'Drug discovery and clinical trial ML.' },
  { name:'Genentech',             sector:'Healthcare AI',  hq:'South San Francisco',roles:['Research Scientist','Computational Biologist'],      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.gene.com/careers',                               visa:true,  notes:'Biotech ML for oncology and immunology.' },
  { name:'BioNTech',              sector:'Biotech / AI',   hq:'Cambridge, MA',      roles:['Research Scientist','Computational Scientist'],      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://biontech.de/career',                                 visa:true,  notes:'mRNA and AI-driven drug design.' },
  { name:'AstraZeneca R&D',       sector:'Healthcare AI',  hq:'Gaithersburg, MD',   roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.astrazeneca.com/search-results?q=data+scientist', visa:true, notes:'Computational drug discovery.' },
  { name:'Moderna',               sector:'Healthcare AI',  hq:'Cambridge, MA',      roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.modernatx.com/en-US/careers',                    visa:true,  notes:'mRNA platform and digital health ML.' },
  { name:'Novartis AI',           sector:'Healthcare AI',  hq:'Cambridge, MA',      roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.novartis.com/careers/career-search',             visa:true,  notes:'Pharma AI and computational biology.' },
  { name:'Stitch Fix',            sector:'Logistics / OR', hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.stitchfix.com/careers',                          visa:true,  notes:'Inventory optimization and personalization.' },
  { name:'Convoy',                sector:'Logistics / OR', hq:'Seattle, WA',        roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://convoy.com/careers/',                                visa:true,  notes:'Digital freight marketplace optimization.' },
  { name:'Tesla',                 sector:'Industry / OR',  hq:'Austin, TX',         roles:['Research Scientist','ML Engineer'],                  ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.tesla.com/careers/search#/?department=6',        visa:true,  notes:'Autopilot, Dojo, energy optimization.' },
  { name:'SpaceX',                sector:'Industry / OR',  hq:'Hawthorne, CA',      roles:['Data Scientist','Research Engineer'],                ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.spacex.com/careers/',                            visa:false, notes:'Launch and satellite optimization. ITAR applies.' },
  { name:'Goldman Sachs',         sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Strategist','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://higher.gs.com/roles?q=quantitative',                 visa:true,  notes:'Strats role is most PhD-relevant.' },
  { name:'JPMorgan AI Research',  sector:'Finance / ML',   hq:'New York, NY',       roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Nov',   intInterview:'Nov-Jan',  intStart:'Jun', url:'https://careers.jpmorgan.com/us/en/students/programs/quant-research-analyst', visa:true, notes:'JPMC AI research team. Growing fast.' },
  { name:'Morgan Stanley',        sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Jul-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://morganstanley.com/people-opportunities/students-graduates', visa:true, notes:'Algorithmic trading and risk research.' },
  { name:'BlackRock',             sector:'Finance / ML',   hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://careers.blackrock.com/early-careers/students/',      visa:true,  notes:'Aladdin platform. Risk and portfolio optimization.' },
  { name:'Robinhood',             sector:'Finance / ML',   hq:'Menlo Park, CA',     roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.robinhood.com/',                             visa:true,  notes:'Retail trading. Fraud and risk ML.' },
  { name:'Plaid',                 sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://plaid.com/careers/openings/',                        visa:true,  notes:'Fintech infrastructure. Fraud and ML.' },
  { name:'SandboxAQ',             sector:'AI Lab',         hq:'Palo Alto, CA',      roles:['Research Scientist','Quantum Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.sandboxaq.com/careers',                          visa:true,  notes:'Quantum + AI. Google Alphabet spin-off.' },
  { name:'Palantir',              sector:'Industry / OR',  hq:'Denver, CO',         roles:['Research Scientist','Forward Deployed Engineer'],   ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.palantir.com/careers/',                          visa:false, notes:'Decomposition interview is unique. Strong mission.' },
  { name:'Waymo',                 sector:'Industry / OR',  hq:'Mountain View, CA',  roles:['Research Scientist','Perception Engineer'],          ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://waymo.com/careers/',                                 visa:true,  notes:'Autonomous driving — perception, planning, sim.' },
  { name:'Millennium Management', sector:'Hedge Fund',     hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.mlp.com/careers/',                               visa:true,  notes:'Multi-manager pod structure.' },
  { name:'Balyasny Asset Mgmt',   sector:'Hedge Fund',     hq:'Chicago, IL',        roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.bamfunds.com/careers',                           visa:true,  notes:'Multi-manager. Data science and quant research.' },
  { name:'WorldQuant',            sector:'Hedge Fund',     hq:'Old Greenwich, CT',  roles:['Quantitative Researcher','Research Consultant'],     ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Year-round',intInterview:'Rolling',  intStart:'Rolling',url:'https://www.worldquant.com/career-listing/',               visa:true,  notes:'Remote-friendly. Alpha research focus.' },
  { name:'Susquehanna (SIG)',     sector:'Quant Finance',  hq:'Bala Cynwyd, PA',    roles:['Quantitative Researcher','Quant Trader'],            ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://sig.com/careers/',                                   visa:true,  notes:'Trading and market making. Math-heavy.' },
  { name:'Akuna Capital',         sector:'Quant Finance',  hq:'Chicago, IL',        roles:['Quantitative Researcher','Quant Developer'],         ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'Aug-Sep',   intInterview:'Sep-Nov',  intStart:'Jun', url:'https://akunacapital.com/careers',                           visa:true,  notes:'Options trading. Python and math focus.' },
  { name:'Qube Research & Tech',  sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher'],                           ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.qube-rt.com/careers/',                           visa:true,  notes:'European quant firm expanding in US.' },
  { name:'Virtu Financial',       sector:'Quant Finance',  hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Aug-Oct',    ftInterview:'Oct-Dec',  ftStart:'Jul',      intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.virtu.com/careers/',                             visa:true,  notes:'High-frequency trading firm.' },
  { name:'Lawrence Livermore Lab',sector:'Government',     hq:'Livermore, CA',      roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.llnl.gov/careers',                               visa:false, notes:'National security and scientific computing.' },
  { name:'Pacific Northwest Lab', sector:'Government',     hq:'Richland, WA',       roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.pnnl.gov/careers',                               visa:true,  notes:'Energy and environmental ML research.' },
  { name:'Johns Hopkins APL',     sector:'Government',     hq:'Laurel, MD',         roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.jhuapl.edu/careers',                             visa:false, notes:'Defense research. OR and ML roles.' },
  { name:'NIST',                  sector:'Government',     hq:'Gaithersburg, MD',   roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.nist.gov/careers',                               visa:true,  notes:'Standards and AI measurement research.' },
  { name:'NIH / NLM',             sector:'Government',     hq:'Bethesda, MD',       roles:['Research Scientist','Postdoc'],                      ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.nih.gov/',                                       visa:true,  notes:'Biomedical data science and ML.' },
  { name:'MITRE Corporation',     sector:'Defense',        hq:'McLean, VA',         roles:['Research Scientist','OR Analyst'],                   ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.mitre.org/',                                 visa:false, notes:'FFRDC. Strong OR and AI research.' },
  { name:'Booz Allen Hamilton',   sector:'Defense',        hq:'McLean, VA',         roles:['Data Scientist','OR Analyst'],                       ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.boozallen.com/careers/find-a-job.html?q=data+scientist', visa:false, notes:'Defense analytics and ML.' },

  { name:'Rebellion Defense',     sector:'Defense',        hq:'Washington, DC',     roles:['ML Research Scientist','Data Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://rebelliondefense.com/careers',                       visa:false, notes:'AI for defense. Clearance often required.' },
  { name:'Leidos',                sector:'Defense',        hq:'Reston, VA',         roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.leidos.com/jobs?q=research+scientist',       visa:false, notes:'Defense and healthcare IT. OR and ML roles.' },
  { name:'Accenture AI',          sector:'Consulting',     hq:'New York, NY',       roles:['Data Scientist','AI Researcher'],                    ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://www.accenture.com/us-en/careers/jobsearch?jk=data+scientist+phd', visa:true, notes:'Large-scale ML and OR deployment.' },
  { name:'Deloitte AI',           sector:'Consulting',     hq:'New York, NY',       roles:['Data Scientist','AI Researcher'],                    ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Sep-Oct',   intInterview:'Oct-Dec',  intStart:'Jun', url:'https://apply.deloitte.com/careers/SearchJobs/data+scientist', visa:true, notes:'AI strategy and implementation.' },
  { name:'Walmart Labs',          sector:'Logistics / OR', hq:'Sunnyvale, CA',      roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://careers.walmart.com/results?q=research+scientist',   visa:true,  notes:'Supply chain and forecasting at massive scale.' },
  { name:'Target (Analytics)',    sector:'Logistics / OR', hq:'Minneapolis, MN',    roles:['Data Scientist','Research Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.target.com/search-jobs?q=data+scientist',       visa:true,  notes:'Supply chain and inventory optimization.' },
  { name:'Wayfair',               sector:'Logistics / OR', hq:'Boston, MA',         roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.wayfair.com/careers/jobs?q=research+scientist',  visa:true,  notes:'Supply chain and pricing research.' },
  { name:'Dropbox',               sector:'Industry / OR',  hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.dropbox.com/teams/engineering',                 visa:true,  notes:'ML for storage, sync and collaboration.' },
  { name:'Spotify',               sector:'Industry / OR',  hq:'New York, NY',       roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://www.lifeatspotify.com/jobs?q=research+scientist',    visa:true,  notes:'Recommendation, audio ML, and NLP.' },
  { name:'Netflix',               sector:'Industry / OR',  hq:'Los Gatos, CA',      roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://jobs.netflix.com/search?q=research+scientist',       visa:true,  notes:'Recommendation systems and personalization.' },
  { name:'Stripe',                sector:'Finance / ML',   hq:'San Francisco, CA',  roles:['Research Scientist','Applied Scientist'],            ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'Oct-Jan',   intInterview:'Jan-Mar',  intStart:'May', url:'https://stripe.com/jobs/search?q=scientist',                 visa:true,  notes:'Fraud detection and payment ML.' },
  { name:'Numerai',               sector:'Hedge Fund',     hq:'San Francisco, CA',  roles:['Research Scientist','Data Scientist'],               ftOpen:'Year-round', ftInterview:'Rolling',  ftStart:'Rolling',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://numer.ai/careers',                                   visa:true,  notes:'Crowdsourced quant fund. ML research.' },
  { name:'Squarepoint Capital',   sector:'Hedge Fund',     hq:'New York, NY',       roles:['Quantitative Researcher','Data Scientist'],          ftOpen:'Sep-Nov',    ftInterview:'Nov-Jan',  ftStart:'Jul-Aug',  intOpen:'N/A',       intInterview:'N/A',      intStart:'N/A', url:'https://www.squarepoint-capital.com/careers',                visa:true,  notes:'Systematic quantitative fund.' },
];

use client';
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

const S = {
  bg:'#0e0f11', surface:'#16181c', surface2:'#1c1f24',
  border:'#252830', border2:'#2e3340',
  blue:'#4f8ef7', blueDim:'#3b7de8',
  cyan:'#22d3ee', green:'#34d399', amber:'#fbbf24',
  purple:'#a78bfa', pink:'#f472b6',
  text:'#e8eaf0', muted:'#5a6072', dim:'#8892a4',
};

const CATEGORIES = [
  { id:'or-ft',     label:'OR Scientist / Engineer',    color:'#4f8ef7', bg:'rgba(79,142,247,.15)',  border:'rgba(79,142,247,.3)',  query:'operations research scientist optimization engineer', keywords:['operations research scientist','operations research engineer','operations research analyst','optimization scientist','optimization engineer','optimization researcher','decision scientist'] },
  { id:'or-int',    label:'OR PhD Internship',          color:'#4f8ef7', bg:'rgba(79,142,247,.1)',   border:'rgba(79,142,247,.2)',  query:'operations research intern phd', keywords:['operations research intern','optimization intern','industrial engineering intern','or intern'] },
  { id:'ml-sci',    label:'ML Research Scientist',      color:'#22d3ee', bg:'rgba(34,211,238,.15)',  border:'rgba(34,211,238,.3)',  query:'machine learning research scientist', keywords:['machine learning research scientist','ml research scientist','machine learning scientist','research scientist, machine learning','research scientist machine learning'] },
  { id:'ml-eng',    label:'ML Research Engineer',       color:'#22d3ee', bg:'rgba(34,211,238,.1)',   border:'rgba(34,211,238,.2)',  query:'machine learning research engineer', keywords:['machine learning research engineer','research engineer, machine learning','ml research engineer'] },
  { id:'ml-int',    label:'ML PhD Internship',          color:'#22d3ee', bg:'rgba(34,211,238,.08)',  border:'rgba(34,211,238,.15)', query:'machine learning phd intern', keywords:['machine learning phd intern','machine learning research intern','ml research intern','ml phd intern'] },
  { id:'ai-sci',    label:'AI Research Scientist',      color:'#34d399', bg:'rgba(52,211,153,.15)',  border:'rgba(52,211,153,.3)',  query:'artificial intelligence research scientist', keywords:['ai research scientist','artificial intelligence research scientist','deep learning scientist','deep learning researcher'] },
  { id:'rl',        label:'Reinforcement Learning',     color:'#a78bfa', bg:'rgba(167,139,250,.15)', border:'rgba(167,139,250,.3)', query:'reinforcement learning researcher', keywords:['reinforcement learning researcher','reinforcement learning scientist','rl researcher','rl scientist'] },
  { id:'nlp',       label:'NLP / LLM Scientist',        color:'#f472b6', bg:'rgba(244,114,182,.15)', border:'rgba(244,114,182,.3)', query:'nlp scientist researcher', keywords:['nlp scientist','nlp researcher','natural language processing scientist','llm researcher','llm scientist'] },
  { id:'quant-ft',  label:'Quantitative Researcher',    color:'#fbbf24', bg:'rgba(251,191,36,.15)',  border:'rgba(251,191,36,.3)',  query:'quantitative researcher', keywords:['quantitative researcher','quant researcher','quantitative research scientist','quantitative scientist','quantitative analyst'] },
  { id:'quant-int', label:'Quant PhD Internship',       color:'#fbbf24', bg:'rgba(251,191,36,.1)',   border:'rgba(251,191,36,.2)',  query:'quantitative research intern phd', keywords:['quantitative research intern','quant research intern','quant intern','quantitative phd intern'] },
  { id:'applied',   label:'Applied Scientist',          color:'#4f8ef7', bg:'rgba(79,142,247,.15)',  border:'rgba(79,142,247,.3)',  query:'applied scientist', keywords:['applied scientist','applied research scientist','applied ml scientist','applied ai scientist'] },
  { id:'data-sci',  label:'Data Scientist (Research)',  color:'#22d3ee', bg:'rgba(34,211,238,.15)',  border:'rgba(34,211,238,.3)',  query:'data scientist research phd', keywords:['staff data scientist','principal data scientist','research data scientist','data scientist phd'] },
];

const DIRECTORY = [
  { name:'Google',         role:'Research Scientist / Applied Scientist', url:'https://careers.google.com/jobs/results/?q=research+scientist&employment_type=FULL_TIME', sector:'Industry', note:'Search "research scientist" — filter by ML, AI, OR teams' },
  { name:'Google DeepMind',role:'Research Scientist',                     url:'https://deepmind.google/careers/jobs/',                                                    sector:'Industry', note:'Browse all open research roles directly' },
  { name:'Meta AI (FAIR)', role:'Research Scientist',                     url:'https://www.metacareers.com/jobs/?teams[0]=Artificial%20Intelligence&teams[1]=Research',   sector:'Industry', note:'Filter by AI and Research teams' },
  { name:'Amazon Science', role:'Applied Scientist / Research Scientist',  url:'https://www.amazon.jobs/en/search?base_query=research+scientist&job_type=Full-Time',      sector:'Industry', note:'Search "research scientist" on Amazon Jobs' },
  { name:'Microsoft Research',role:'Researcher',                          url:'https://careers.microsoft.com/us/en/search-results?keywords=researcher&experience=Experienced%20professionals', sector:'Industry', note:'Filter by Research division' },
  { name:'Apple',          role:'AI/ML Research Scientist',               url:'https://jobs.apple.com/en-us/search?search=research+scientist&sort=newest',                sector:'Industry', note:'Search "research scientist" on Apple Jobs' },
  { name:'Jane Street',    role:'Quantitative Researcher',                 url:'https://www.janestreet.com/join-jane-street/open-roles/?type=full-time-employee&role=quantitative-researcher', sector:'Finance', note:'Direct link to QR full-time roles' },
  { name:'Two Sigma',      role:'Quantitative Researcher',                 url:'https://www.twosigma.com/careers/',                                                       sector:'Finance', note:'Browse all open research positions' },
  { name:'Citadel',        role:'Quantitative Researcher',                 url:'https://www.citadel.com/careers/open-opportunities/students/quant/?program=Quant+Researcher', sector:'Finance', note:'Direct QR role listing' },
  { name:'D.E. Shaw',      role:'Quantitative Analyst / Researcher',       url:'https://www.deshaw.com/careers/choose-your-path',                                        sector:'Finance', note:'Choose Quantitative Research path' },
  { name:'Renaissance Tech',role:'Researcher',                            url:'https://careers.rentec.com/',                                                             sector:'Finance', note:'Very selective — direct application page' },
  { name:'Bridgewater',    role:'Investment Associate / Researcher',       url:'https://www.bridgewater.com/about-bridgewater/career-opportunities',                      sector:'Finance', note:'Research and investment roles' },
  { name:'AQR Capital',    role:'Quantitative Researcher',                 url:'https://careers.aqr.com/jobs#/',                                                         sector:'Finance', note:'Browse all quant research openings' },
  { name:'McKinsey QuantumBlack',role:'Data Scientist / ML Engineer',     url:'https://www.mckinsey.com/careers/search-jobs#?query=quantumblack',                        sector:'Consulting', note:'Search QuantumBlack within McKinsey careers' },
  { name:'RAND Corporation',role:'Operations Researcher',                  url:'https://www.rand.org/jobs.html',                                                          sector:'Government', note:'Policy-focused OR roles' },
  { name:'Argonne National Lab',role:'Postdoc / Research Scientist',       url:'https://www.anl.gov/careers',                                                            sector:'Government', note:'DOE national lab — strong ML and OR groups' },
  { name:'Sandia National Labs',role:'R&D Scientist / Engineer',           url:'https://jobs.sandia.gov/',                                                               sector:'Government', note:'US citizenship required for most roles' },
  { name:'Oak Ridge National Lab',role:'Research Scientist',               url:'https://jobs.ornl.gov/',                                                                 sector:'Government', note:'Strong data science and computing division' },
];


const INTERVIEW_NOTES = {
  'Anthropic':           { rounds:'4-5 rounds', format:'Research presentation + coding + values interview', note:'Heavy focus on alignment thinking and research taste. Expect to discuss your PhD work deeply.' },
  'OpenAI':              { rounds:'4-5 rounds', format:'Research talk + technical + culture fit', note:'Very research-focused. Strong publication record expected. Independent thinking valued.' },
  'Google DeepMind':     { rounds:'4-6 rounds', format:'Coding + ML theory + research presentation', note:'LeetCode medium/hard + ML fundamentals. Research presentation is the most important round.' },
  'Scale AI':            { rounds:'3-4 rounds', format:'Coding + ML system design + research', note:'Fast process (~2-3 weeks). Strong emphasis on practical ML engineering alongside research.' },
  'Waymo':               { rounds:'4-5 rounds', format:'Coding + ML + domain-specific', note:'Domain knowledge matters a lot. Expect questions specific to autonomy stack (perception/planning).' },
  'Databricks':          { rounds:'4 rounds', format:'Coding + system design + ML depth', note:'Strong focus on distributed systems and ML at scale.' },
  'Palantir':            { rounds:'3 rounds', format:'Decomposition exercise + technical + culture', note:'Unique decomposition round — breaking down ambiguous problems. Very different from standard ML interviews.' },
  'DoorDash':            { rounds:'4 rounds', format:'Coding + OR/optimization + product sense', note:'OR roles are genuinely OR — expect LP/IP formulations and optimization coding.' },
  'Hudson River Trading':{ rounds:'3-4 rounds', format:'Math/prob + coding + market making', note:'Very math-heavy. Mental math and probability puzzles in early rounds. Coding is Python/C++.' },
  'Jump Trading':        { rounds:'3 rounds', format:'Quant problem sets + technical + fit', note:'Problem sets sent in advance. Probability, statistics, and algorithm questions.' },
  'IMC Trading':         { rounds:'3-4 rounds', format:'Math + coding + trading simulation', note:'Trading simulation round tests decision-making under uncertainty.' },
  'Optiver':             { rounds:'3-4 rounds', format:'Mental math + probability + coding', note:'80-in-8 mental math test is the first filter. Then probability and trading strategy.' },
  'Point72 / Cubist':    { rounds:'3-5 rounds', format:'Quant research presentation + coding + PM', note:'Research presentation of your own work is central. They invest in your ideas.' },
  'Schonfeld':           { rounds:'3-4 rounds', format:'Stats + ML + research discussion', note:'More collaborative than most quant firms. ML background valued.' },
};

const CALENDAR = [
  // ── Big Tech — Full Time ──────────────────────────────────────────────────
  { company:'Google / DeepMind',     sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Jan-Feb',    interviewMonth:'Feb-Apr', startMonth:'Aug-Sep', notes:'New grad PhD roles open Jan. DeepMind hires rolling year-round.' },
  { company:'Meta AI (FAIR)',         sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Jan-Mar',    interviewMonth:'Mar-May', startMonth:'Sep-Oct', notes:'FAIR PhD hiring is competitive and referral-driven. Research presentation is key.' },
  { company:'Microsoft Research',    sector:'Industry',  type:'Full-Time', role:'Researcher',                     openMonth:'Nov-Feb',    interviewMonth:'Feb-Apr', startMonth:'Sep',     notes:'MSR hires on rolling basis. Each lab hires independently.' },
  { company:'Amazon Science',        sector:'Industry',  type:'Full-Time', role:'Applied Scientist',              openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Hires continuously. Bar raiser interview is a final extra round.' },
  { company:'Apple',                 sector:'Industry',  type:'Full-Time', role:'ML Research Scientist',          openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'AI/ML Research team. Mostly through referrals and conferences.' },
  { company:'NVIDIA',                sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Strong DL research team. GPU architecture + ML research roles.' },
  // ── AI Labs — Full Time ───────────────────────────────────────────────────
  { company:'Anthropic',             sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Rolling hiring. Fast process (~3 weeks). Values interview is significant.' },
  { company:'OpenAI',                sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Highly competitive. Strong publication record expected.' },
  { company:'xAI',                   sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Elon Musk AI company. Fast growing, small team, high impact.' },
  { company:'Mistral AI',            sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Paris-based but remote-friendly. Strong LLM research focus.' },
  { company:'Scale AI',              sector:'Industry',  type:'Full-Time', role:'ML Research Scientist',          openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Fast process (~2-3 weeks). LLM and post-training focus.' },
  { company:'Cohere',                sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Enterprise LLM focus. Strong NLP research team.' },
  { company:'Waymo',                 sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Domain-specific — perception, planning, simulation.' },
  { company:'Databricks',            sector:'Industry',  type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Strong focus on distributed ML at scale.' },
  { company:'Palantir',              sector:'Industry',  type:'Full-Time', role:'Research Scientist / OR',        openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Unique decomposition interview. Culture fit round is significant.' },
  { company:'DoorDash',              sector:'Industry',  type:'Full-Time', role:'OR Scientist',                   openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'OR team is strong and growing. Optimization coding + case study.' },
  // ── Big Tech — Internships ────────────────────────────────────────────────
  { company:'Google',                sector:'Industry',  type:'Internship', role:'Research Intern (PhD)',          openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'May-Jun', notes:'Apply early — PhD intern roles fill fast. Strong preference for NeurIPS/ICML applicants.' },
  { company:'Meta AI',               sector:'Industry',  type:'Internship', role:'Research Intern (PhD)',          openMonth:'Sep-Oct',    interviewMonth:'Oct-Dec', startMonth:'May-Jun', notes:'FAIR intern program highly competitive. Publication record required.' },
  { company:'Microsoft Research',    sector:'Industry',  type:'Internship', role:'Research Intern',                openMonth:'Oct-Dec',    interviewMonth:'Dec-Feb', startMonth:'May-Jun', notes:'Each MSR lab recruits independently. Reach out directly to researchers.' },
  { company:'Amazon',                sector:'Industry',  type:'Internship', role:'Applied Scientist Intern',       openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'May-Jun', notes:'Apply to multiple teams. Process is similar to full-time.' },
  { company:'Apple',                 sector:'Industry',  type:'Internship', role:'ML Research Intern',             openMonth:'Oct-Jan',    interviewMonth:'Jan-Mar', startMonth:'May-Jun', notes:'Referral-heavy. Conference recruiting is a main entry point.' },
  { company:'NVIDIA',                sector:'Industry',  type:'Internship', role:'Research Intern',                openMonth:'Oct-Jan',    interviewMonth:'Jan-Mar', startMonth:'May-Jun', notes:'GPU and DL research internships. Strong return offer rate.' },
  // ── AI Lab Internships ────────────────────────────────────────────────────
  { company:'Anthropic',             sector:'Industry',  type:'Internship', role:'Research Intern (PhD)',          openMonth:'Oct-Jan',    interviewMonth:'Jan-Mar', startMonth:'May-Jun', notes:'Alignment and capabilities research internships. Same process as full-time.' },
  { company:'OpenAI',                sector:'Industry',  type:'Internship', role:'Research Intern (PhD)',          openMonth:'Oct-Dec',    interviewMonth:'Dec-Feb', startMonth:'May-Jun', notes:'Highly competitive. Research contributions expected.' },
  { company:'Scale AI',              sector:'Industry',  type:'Internship', role:'ML Research Intern',             openMonth:'Oct-Jan',    interviewMonth:'Jan-Mar', startMonth:'May-Jun', notes:'Fast process. Strong LLM and evaluation research focus.' },
  // ── Quant Finance — Full Time ─────────────────────────────────────────────
  { company:'Jane Street',           sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jul-Aug', notes:'Multi-day on-site. Probability and market-making heavy.' },
  { company:'Two Sigma',             sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul-Aug', notes:'Research-heavy. ML and stats depth. Process takes 4-8 weeks.' },
  { company:'Citadel / Securities',  sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jul',     notes:'Very fast process (1-2 weeks). Citadel and Securities hire separately.' },
  { company:'Hudson River Trading',  sector:'Finance',   type:'Full-Time', role:'Algorithm Developer / Quant',    openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jul',     notes:'CS + quant combo valued. Coding rounds rigorous (C++/Python).' },
  { company:'D.E. Shaw',             sector:'Finance',   type:'Full-Time', role:'Quantitative Analyst',           openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul-Aug', notes:'Thorough process. Probability, CS, and research discussion rounds.' },
  { company:'IMC Trading',           sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul',     notes:'Trading simulation round. Strong math and intuition expected.' },
  { company:'Optiver',               sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Oct-Dec', startMonth:'Jul',     notes:'80-in-8 mental math test is first filter.' },
  { company:'Point72 / Cubist',      sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul-Aug', notes:'Cubist (systematic) most relevant for PhD OR/ML.' },
  { company:'Schonfeld',             sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Oct-Dec', startMonth:'Jul',     notes:'More collaborative culture. ML background valued.' },
  { company:'AQR Capital',           sector:'Finance',   type:'Full-Time', role:'Quantitative Researcher',        openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul-Aug', notes:'Factor investing focus. Strong statistics background required.' },
  { company:'Renaissance Technologies',sector:'Finance', type:'Full-Time', role:'Researcher',                     openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Most selective firm. PhD in math/physics/CS strongly preferred.' },
  { company:'Bridgewater',           sector:'Finance',   type:'Full-Time', role:'Investment Researcher',          openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Jul-Aug', notes:'Macro research focus. Unique culture interview.' },
  // ── Quant Finance — Internships ───────────────────────────────────────────
  { company:'Jane Street',           sector:'Finance',   type:'Internship', role:'PhD Quant Research Intern',     openMonth:'Aug-Sep',    interviewMonth:'Sep-Nov', startMonth:'Jun',     notes:'Same process as full-time. High return offer rate.' },
  { company:'Two Sigma',             sector:'Finance',   type:'Internship', role:'PhD Quant Research Intern',     openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jun',     notes:'Early application strongly advised.' },
  { company:'Citadel',               sector:'Finance',   type:'Internship', role:'PhD Quant Research Intern',     openMonth:'Jul-Sep',    interviewMonth:'Sep-Nov', startMonth:'Jun',     notes:'PhD intern track separate from undergrad.' },
  { company:'Hudson River Trading',  sector:'Finance',   type:'Internship', role:'Quant Research Intern',         openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jun',     notes:'Coding-heavy. Python/C++ required.' },
  { company:'Optiver',               sector:'Finance',   type:'Internship', role:'PhD Quant Research Intern',     openMonth:'Aug-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jun',     notes:'NeurIPS recruiting booth good entry point for ML PhDs.' },
  { company:'IMC Trading',           sector:'Finance',   type:'Internship', role:'Quant Research Intern',         openMonth:'Aug-Oct',    interviewMonth:'Oct-Nov', startMonth:'Jun',     notes:'High return offer rate.' },
  { company:'Schonfeld',             sector:'Finance',   type:'Internship', role:'PhD Quant Research Intern',     openMonth:'Sep-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jun',     notes:'10-week program.' },
  { company:'AQR Capital',           sector:'Finance',   type:'Internship', role:'Quant Research Intern',         openMonth:'Sep-Oct',    interviewMonth:'Oct-Dec', startMonth:'Jun',     notes:'Strong factor investing focus.' },
  // ── Consulting ────────────────────────────────────────────────────────────
  { company:'McKinsey QuantumBlack', sector:'Consulting',type:'Full-Time', role:'Data Scientist / ML Engineer',   openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Sep',     notes:'Case interview + data science technical. ML engineering focus.' },
  { company:'BCG GAMMA',             sector:'Consulting',type:'Full-Time', role:'Data Scientist',                 openMonth:'Sep-Nov',    interviewMonth:'Nov-Jan', startMonth:'Sep',     notes:'AI/ML consulting arm of BCG. Case + technical rounds.' },
  // ── Government / National Labs ────────────────────────────────────────────
  { company:'Argonne National Lab',  sector:'Government',type:'Full-Time', role:'Postdoc / Research Scientist',   openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'DOE lab. Strong OR and ML programs.' },
  { company:'Sandia National Labs',  sector:'Government',type:'Full-Time', role:'R&D Scientist',                  openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'US citizenship required. Strong optimization group.' },
  { company:'Oak Ridge National Lab',sector:'Government',type:'Full-Time', role:'Research Scientist',             openMonth:'Year-round', interviewMonth:'Rolling', startMonth:'Rolling', notes:'Strong data science and computing division.' },
  { company:'RAND Corporation',      sector:'Government',type:'Full-Time', role:'Operations Researcher',          openMonth:'Oct-Jan',    interviewMonth:'Jan-Mar', startMonth:'Sep',     notes:'Policy-focused OR. Strong writing sample expected.' },
];


const RESOURCES = {
  or: {
    label:'Operations Research', color:'#4f8ef7',
    specializations:[
      { key:'all', label:'All OR' },
      { key:'logistics', label:'Rideshare & Delivery' },
      { key:'ecom', label:'E-commerce & Supply Chain' },
      { key:'revenue', label:'Revenue Management' },
    ],
    books:[
      { title:'Convex Optimization', authors:'Boyd & Vandenberghe', note:'Free PDF online. The most useful theory book for every OR industry role.', url:'https://web.stanford.edu/~boyd/cvxbook/', specs:['all','logistics','ecom','revenue'] },
      { title:'Algorithms for Optimization', authors:'Kochenderfer & Wheeler', note:'Free PDF — modern, covers everything used in industry. Better starting point than Hillier.', url:'https://algorithmsbook.com/', specs:['all'] },
      { title:'Introduction to Operations Research', authors:'Hillier & Lieberman', note:'The standard grad-school OR textbook — LP, IP, queuing reference.', url:'https://www.amazon.com/dp/1259872998', specs:['all'] },
      { title:'Supply Chain Management', authors:'Chopra & Meindl', note:'Definitive supply chain book — used at Amazon, FedEx, Walmart.', url:'https://www.amazon.com/dp/0136182135', specs:['all','ecom','logistics'] },
      { title:'The Price Advantage', authors:'Baker, Marn & Zawada', note:'Pricing strategy used by McKinsey revenue management practices.', url:'https://www.amazon.com/dp/0471395242', specs:['all','revenue'] },
    ],
    courses:[
      { title:'Convex Optimization (Stanford)', platform:'Stephen Boyd · YouTube', note:'Free. Most useful course for OR industry roles.', url:'https://www.youtube.com/playlist?list=PL3940DD956CDF0622', specs:['all','logistics','ecom','revenue'] },
      { title:'Discrete Optimization', platform:'Coursera', note:'Hands-on constraint programming and integer programming.', url:'https://www.coursera.org/learn/discrete-optimization', specs:['all','logistics','ecom'] },
      { title:'Gurobi Tutorials & Modeling Examples', platform:'Gurobi', note:'The solver used at DoorDash, Amazon, FedEx. Free academic license.', url:'https://www.gurobi.com/resources/examples/example-models/', specs:['all','logistics','ecom'] },
      { title:'Supply Chain Analytics', platform:'MITx / edX', note:'MIT supply chain fundamentals with real case studies.', url:'https://www.edx.org/learn/supply-chain-management/massachusetts-institute-of-technology-supply-chain-analytics', specs:['all','ecom','logistics'] },
    ],
    articles:[
      { title:'Next-Gen Optimization for Dasher Dispatch', authors:'DoorDash Engineering', url:'https://doordash.engineering/2020/02/28/next-generation-optimization-for-dasher-dispatch-at-doordash/', specs:['all','logistics'] },
      { title:'Matchmaking in Lyft Marketplace', authors:'Lyft Engineering', url:'https://eng.lyft.com/matchmaking-in-lyfts-marketplace-691ebfe0cd88', specs:['all','logistics'] },
      { title:'How Instacart Uses Operations Research', authors:'Instacart Tech Blog', url:'https://tech.instacart.com/', specs:['all','logistics','ecom'] },
      { title:'Supply Chain Optimization at Amazon', authors:'Amazon Science', url:'https://www.amazon.science/research-areas/supply-chain-optimization', specs:['all','ecom'] },
      { title:'Dynamic Pricing at Airbnb', authors:'Airbnb Engineering', url:'https://medium.com/airbnb-engineering/learning-market-dynamics-for-optimal-pricing-97cffbcc53e3', specs:['all','revenue'] },
      { title:'Franz Edelman Award — Real OR Impact Stories', authors:'INFORMS', url:'https://www.informs.org/Recognizing-Excellence/INFORMS-Prizes/Franz-Edelman-Award/Finalists-and-Winners', specs:['all'] },
    ],
    interview:[
      { title:'Gurobi Modeling Examples', note:'Practice these before OR interviews at DoorDash and Amazon.', url:'https://www.gurobi.com/resources/examples/example-models/', specs:['all','logistics','ecom'] },
      { title:'LeetCode Dynamic Programming', note:'Many OR coding interviews include DP problems. Grind 75 is a solid list.', url:'https://leetcode.com/tag/dynamic-programming/', specs:['all'] },
    ],
  },
  ml: {
    label:'Machine Learning', color:'#22d3ee',
    specializations:[
      { key:'all', label:'All ML' },
      { key:'recsys', label:'Recommender Systems' },
      { key:'cv', label:'Computer Vision' },
      { key:'ts', label:'Time Series' },
      { key:'bio', label:'AI for Science' },
    ],
    books:[
      { title:'Designing Machine Learning Systems', authors:'Chip Huyen', note:'The definitive industry ML book — what Google, Meta, Airbnb do in production.', url:'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/', specs:['all','recsys','cv','ts','bio'] },
      { title:'Ace the Data Science Interview', authors:'Nick Singh & Kevin Huo', note:'201 real DS/ML interview questions from FAANG. Highly rated on Reddit for interview prep.', url:'https://www.acethedatascienceinterview.com/', specs:['all','recsys','ts'] },
      { title:'Hands-On Machine Learning (3rd ed)', authors:'Aurelie Geron', note:'Most recommended on r/learnmachinelearning — sklearn, Keras, PyTorch.', url:'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', specs:['all'] },
      { title:'Understanding Deep Learning', authors:'Simon Prince', note:'Free PDF — the most modern DL textbook (2024).', url:'https://udlbook.github.io/udlbook/', specs:['all','cv'] },
      { title:'Practical Recommender Systems', authors:'Kim Falk', note:'End-to-end recommender systems — used at Netflix, Spotify, Amazon.', url:'https://www.amazon.com/dp/1617292702', specs:['all','recsys'] },
      { title:'Forecasting: Principles and Practice', authors:'Hyndman & Athanasopoulos', note:'Free online — the best time series forecasting book.', url:'https://otexts.com/fpp3/', specs:['all','ts'] },
      { title:'Deep Learning for the Life Sciences', authors:'Bharath Ramsundar', note:'ML applied to drug discovery, genomics, medical imaging.', url:'https://www.oreilly.com/library/view/deep-learning-for/9781492039822/', specs:['all','bio'] },
    ],
    courses:[
      { title:'Machine Learning Specialization', platform:'Andrew Ng · Coursera', note:'245+ mentions on r/MachineLearning — the most recommended intro ML course. Supervised, unsupervised, RL.', url:'https://www.coursera.org/specializations/machine-learning-introduction', specs:['all'] },
      { title:'Deep Learning Specialization', platform:'Andrew Ng · Coursera', note:'Standard deep learning course sequence — 5 courses covering CNNs, RNNs, transformers.', url:'https://www.coursera.org/specializations/deep-learning', specs:['all','cv'] },
      { title:'Neural Nets: Zero to Hero', platform:'Andrej Karpathy · YouTube', note:'Build GPT from scratch — most endorsed ML course right now. Free.', url:'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', specs:['all'] },
      { title:'fast.ai Practical Deep Learning', platform:'fast.ai', note:'180+ endorsements on r/learnmachinelearning. Top-down, free, practical.', url:'https://course.fast.ai/', specs:['all','cv'] },
      { title:'Full Stack Deep Learning', platform:'UC Berkeley', note:'Deploying ML in production — what no academic course teaches. Free.', url:'https://fullstackdeeplearning.com/', specs:['all'] },
      { title:'CS231n: Deep Learning for Vision', platform:'Stanford', note:'Free — foundational computer vision and deep learning.', url:'https://cs231n.stanford.edu/', specs:['all','cv'] },
      { title:'Time Series Forecasting', platform:'Udacity', note:'Practical forecasting — ARIMA to neural nets with real datasets.', url:'https://www.udacity.com/course/time-series-forecasting--ud980', specs:['all','ts'] },
    ],
    articles:[
      { title:'Attention Is All You Need', authors:'Vaswani et al. (2017)', url:'https://arxiv.org/abs/1706.03762', specs:['all'] },
      { title:'Scaling Laws for Neural Language Models', authors:'Kaplan et al., OpenAI (2020)', url:'https://arxiv.org/abs/2001.08361', specs:['all'] },
      { title:'Deep Neural Networks for YouTube Recommendations', authors:'Google (2016)', url:'https://dl.acm.org/doi/10.1145/2959100.2959190', specs:['all','recsys'] },
      { title:'How Netflix Thinks About Recommendations', authors:'Netflix Tech Blog', url:'https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429', specs:['all','recsys'] },
      { title:'Instagram Embedding-Based Retrieval', authors:'Meta Engineering', url:'https://engineering.fb.com/2020/09/10/ml-applications/instagram-search/', specs:['all','recsys'] },
      { title:'An Image is Worth 16x16 Words (ViT)', authors:'Dosovitskiy et al. (2020)', url:'https://arxiv.org/abs/2010.11929', specs:['all','cv'] },
      { title:'Waymo Research Blog', authors:'Waymo', url:'https://waymo.com/research/', specs:['all','cv'] },
      { title:'AlphaFold: Protein Structure Prediction', authors:'DeepMind (2021)', url:'https://www.nature.com/articles/s41586-021-03819-2', specs:['all','bio'] },
      { title:'Google DeepMind Research Blog', authors:'Google DeepMind', url:'https://deepmind.google/research/', specs:['all','bio'] },
    ],
    interview:[
      { title:'ML System Design Guide', authors:'Chip Huyen · Free', note:'Covers exactly what ML research scientist interviews test at Google and Meta.', url:'https://github.com/chiphuyen/machine-learning-systems-design', specs:['all'] },
      { title:'Build nanoGPT from scratch', authors:'Karpathy', note:'Doing this exercise impresses in any ML research interview.', url:'https://github.com/karpathy/nanoGPT', specs:['all'] },
      { title:'Papers With Code', authors:'', note:'Stay current — interviewers at Anthropic and Scale AI ask about recent papers.', url:'https://paperswithcode.com/', specs:['all','cv','recsys'] },
    ],
  },
  quant: {
    label:'Quant Finance', color:'#fbbf24',
    specializations:[],
    books:[
      { title:'A Practical Guide to Quant Finance Interviews', authors:'Xinfeng Zhou (The Green Book)', note:'Most used quant interview prep book. Read chapters 1, 2, 4, 5 first.', url:'https://www.amazon.com/dp/1438236662', specs:['all'] },
      { title:'Heard on the Street', authors:'Timothy Crack', note:'Classic probability brainteasers — exactly what Optiver and Jane Street ask.', url:'https://www.amazon.com/dp/0994103867', specs:['all'] },
      { title:'Quant Job Interview Questions & Answers', authors:'Mark Joshi', note:'Supplement to the Green Book. Do Green Book first.', url:'https://www.amazon.com/dp/0987122800', specs:['all'] },
      { title:'Advances in Financial Machine Learning', authors:'Lopez de Prado', note:'ML applied to systematic trading — used at Two Sigma, AQR, DE Shaw.', url:'https://www.amazon.com/dp/1119482089', specs:['all'] },
    ],
    courses:[
      { title:'Harvard Statistics 110: Probability', platform:'YouTube / Harvard', note:'Highly recommended on Wall Street Oasis. Prob/stats is 70% of trading interviews.', url:'https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo', specs:['all'] },
      { title:'MIT 18.S096: Math with Finance', platform:'MIT OpenCourseWare', note:'Free — stochastic calculus, portfolio theory, market microstructure.', url:'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/', specs:['all'] },
    ],
    articles:[
      { title:'Jane Street: Probability & Markets Guide', authors:'Jane Street Capital', url:'https://www.janestreet.com/static/pdfs/trading-interview.pdf', specs:['all'] },
      { title:'Two Sigma Insights Research Library', authors:'Two Sigma', url:'https://www.twosigma.com/insights/', specs:['all'] },
      { title:'AQR Capital Research Library', authors:'AQR', url:'https://www.aqr.com/Insights/Research', specs:['all'] },
      { title:'Citadel: Technology and Quantitative Research', authors:'Citadel', url:'https://www.citadel.com/technology/', specs:['all'] },
    ],
    interview:[
      { title:'Jane Street Puzzles', note:'Official puzzles — the lateral thinking Jane Street tests.', url:'https://www.janestreet.com/puzzles/', specs:['all'] },
      { title:'50 Challenging Problems in Probability', note:'Mosteller — appear in Optiver and IMC phone screens.', url:'https://www.amazon.com/dp/0486653552', specs:['all'] },
      { title:'Grind 75 (LeetCode)', note:'For HRT and Two Sigma — probability + stats + coding combo.', url:'https://www.techinterviewhandbook.org/grind75', specs:['all'] },
    ],
  },
  nlp: {
    label:'NLP / LLM', color:'#f472b6',
    specializations:[],
    books:[
      { title:'Build a Large Language Model From Scratch', authors:'Sebastian Raschka (2024)', note:'Best current LLM book — implement GPT from scratch with PyTorch.', url:'https://www.amazon.com/dp/1633437167', specs:['all'] },
      { title:'Natural Language Processing with Transformers', authors:'Tunstall et al. (HuggingFace)', note:'Practical transformers — the industry standard NLP reference.', url:'https://transformersbook.com/', specs:['all'] },
      { title:'Speech and Language Processing', authors:'Jurafsky & Martin', note:'Free online — foundational NLP. Third edition covers LLMs.', url:'https://web.stanford.edu/~jurafsky/slp3/', specs:['all'] },
    ],
    courses:[
      { title:'HuggingFace NLP Course', platform:'HuggingFace', note:'Free — the best practical transformers course.', url:'https://huggingface.co/learn/nlp-course', specs:['all'] },
      { title:'CS224N: NLP with Deep Learning', platform:'Stanford', note:'Free — Christopher Manning. The NLP research course.', url:'https://web.stanford.edu/class/cs224n/', specs:['all'] },
      { title:'Andrej Karpathy: makemore series', platform:'YouTube', note:'Build language models from scratch — impresses in any NLP interview.', url:'https://www.youtube.com/watch?v=PaCmpygFfXo', specs:['all'] },
    ],
    articles:[
      { title:'Attention Is All You Need', authors:'Vaswani et al. (2017)', url:'https://arxiv.org/abs/1706.03762', specs:['all'] },
      { title:'Language Models are Few-Shot Learners (GPT-3)', authors:'OpenAI (2020)', url:'https://arxiv.org/abs/2005.14165', specs:['all'] },
      { title:'Constitutional AI', authors:'Anthropic (2022)', url:'https://arxiv.org/abs/2212.08073', specs:['all'] },
      { title:'OpenAI Research Blog', authors:'OpenAI', url:'https://openai.com/research', specs:['all'] },
      { title:'Anthropic Research Blog', authors:'Anthropic', url:'https://www.anthropic.com/research', specs:['all'] },
    ],
    interview:[
      { title:'LLM Engineering Guide', authors:'Chip Huyen', note:'What NLP/LLM scientist interviews at Cohere and Anthropic actually test.', url:'https://huyenchip.com/2023/04/11/llm-engineering.html', specs:['all'] },
      { title:'ML Papers of the Week', authors:'', note:'Stay current — interviewers ask about papers from the last 6 months.', url:'https://github.com/dair-ai/ML-Papers-of-the-Week', specs:['all'] },
    ],
  },
  rl: {
    label:'Reinforcement Learning', color:'#a78bfa',
    specializations:[],
    books:[
      { title:'Reinforcement Learning: An Introduction', authors:'Sutton & Barto', note:'Free online — the RL bible. Read before any RL interview.', url:'http://incompleteideas.net/book/the-book-2nd.html', specs:['all'] },
      { title:'Deep Reinforcement Learning Hands-On', authors:'Maxim Lapan', note:'Best practical RL book — PyTorch implementations of DQN, PPO, SAC.', url:'https://www.amazon.com/dp/1838826998', specs:['all'] },
    ],
    courses:[
      { title:'David Silver RL Course (DeepMind/UCL)', platform:'YouTube', note:'Free — 10 lectures. The definitive RL course. Watch all of it.', url:'https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ', specs:['all'] },
      { title:'Spinning Up in Deep RL', platform:'OpenAI', note:'Free — clean PyTorch implementations. Best way to learn RL by doing.', url:'https://spinningup.openai.com/', specs:['all'] },
    ],
    articles:[
      { title:'Proximal Policy Optimization (PPO)', authors:'Schulman et al., OpenAI (2017)', url:'https://arxiv.org/abs/1707.06347', specs:['all'] },
      { title:'AlphaZero: Mastering Chess and Shogi', authors:'Silver et al., DeepMind (2017)', url:'https://arxiv.org/abs/1712.01815', specs:['all'] },
      { title:'Google DeepMind RL Research', authors:'Google DeepMind', url:'https://deepmind.google/research/reinforcement-learning/', specs:['all'] },
    ],
    interview:[
      { title:'Key Papers in Deep RL — OpenAI Spinning Up', note:'Papers to know before any RL interview at DeepMind.', url:'https://spinningup.openai.com/en/latest/spinningup/keypapers.html', specs:['all'] },
      { title:'CleanRL: PPO from scratch', note:'Implement PPO cleanly — most RL teams ask you to walk through this.', url:'https://github.com/vwxyzjn/cleanrl', specs:['all'] },
    ],
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Sora',sans-serif;background:#0e0f11;color:#e8eaf0;min-height:100vh;font-size:14px;-webkit-font-smoothing:antialiased}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .card{animation:fu .22s ease both}
  .spinner{width:24px;height:24px;border:2px solid #252830;border-top-color:#4f8ef7;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 1rem}
  .cat-btn{transition:background .15s,border-color .15s,color .15s;cursor:pointer}
  .cat-btn:hover{filter:brightness(1.06)}
  tr:hover td{background:rgba(255,255,255,.02)}
`;

function isIntern(j){ return /intern|summer|co-op/i.test((j.type||'')+(j.title||'')); }
function domainColor(d=''){
  d=d.toLowerCase();
  if(/\bor\b|optim|stoch|supply/.test(d)) return S.blue;
  if(/\bml\b|machine|deep|nlp/.test(d))   return S.cyan;
  if(/\bai\b|reinforce|\brl\b/.test(d))   return S.green;
  if(/quant|finance/.test(d))             return S.amber;
  return S.dim;
}
function domainLabel(d=''){
  d=d.toLowerCase();
  if(/\bor\b|optim|stoch|supply/.test(d)) return 'OR';
  if(/\bml\b|machine|deep|nlp/.test(d))  return 'ML';
  if(/\bai\b|reinforce|\brl\b/.test(d))  return 'AI';
  if(/quant|finance/.test(d))            return 'Quant';
  return d.toUpperCase().slice(0,5)||'Mixed';
}

function InterviewNote({ note }) {
  return (
    <div style={{gridColumn:'1/-1',background:'rgba(167,139,250,.08)',border:'1px solid rgba(167,139,250,.25)',borderRadius:6,padding:'.75rem 1rem',marginTop:'.3rem',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'.5rem .8rem'}}>
      <div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'#a78bfa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.2rem'}}>Rounds</div>
        <div style={{fontSize:'.78rem',color:S.dim}}>{note.rounds}</div>
      </div>
      <div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'#a78bfa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.2rem'}}>Format</div>
        <div style={{fontSize:'.78rem',color:S.dim}}>{note.format}</div>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'#a78bfa',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.2rem'}}>What to expect</div>
        <div style={{fontSize:'.78rem',color:S.dim,lineHeight:1.6}}>{note.note}</div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : (children ? [children] : []);
  if (items.length === 0) return null;
  return (
    <div style={{marginBottom:'2rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'1rem'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color}}>{title}</span>
        <div style={{flex:1,height:1,background:S.border}}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'.6rem'}}>
        {items}
      </div>
    </div>
  );
}

function ResourceCard({ title, sub, note, url, color, tag }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{display:'block',background:S.surface,border:`1px solid ${S.border}`,borderRadius:8,padding:'1rem 1.1rem',textDecoration:'none',color:'inherit',transition:'border-color .15s,transform .15s'}}
      onMouseOver={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseOut={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.transform='none'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'.5rem',marginBottom:'.4rem'}}>
        <span style={{fontFamily:"'Sora',sans-serif",fontSize:'.88rem',fontWeight:500,color:S.text,lineHeight:1.3}}>{title}</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',padding:'.12rem .45rem',borderRadius:4,background:`${color}20`,color:color,border:`1px solid ${color}50`,whiteSpace:'nowrap',flexShrink:0}}>{tag}</span>
      </div>
      {sub && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:color,marginBottom:'.3rem',opacity:.8}}>{sub}</div>}
      {note && <div style={{fontSize:'.77rem',color:S.dim,lineHeight:1.55}}>{note}</div>}
    </a>
  );
}

export default function Home() {
  const [jobs,      setJobs]      = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeCat, setActiveCat] = useState(null);
  const [copied,    setCopied]    = useState(null);
  const [mainTab,   setMainTab]   = useState('jobs');
  const [resField,  setResField]  = useState('or');
  const [resSpec,   setResSpec]   = useState('all');
  const [calFilter, setCalFilter] = useState('all');
  const [compSearch, setCompSearch] = useState('');
  const [compSector, setCompSector] = useState('All');
  const [compType,   setCompType]   = useState('All');
  const [compVisa,   setCompVisa]   = useState(false);
  const [calTypeFilter, setCalTypeFilter] = useState('all');
  const [dirFilter,     setDirFilter]     = useState('All');
  const [sortBy,    setSortBy]    = useState('relevance');
  const [noteJob,   setNoteJob]   = useState(null);

  const search = useCallback(async (cat) => {
    setActiveCat(cat.id);
    setLoading(true); setError(null); setJobs([]);
    setActiveTab('all');
    try {
      const params = new URLSearchParams({ q:cat.query, kw:JSON.stringify(cat.keywords), stream:'1' });
      const res = await fetch('/api/jobs?' + params.toString());
      if (!res.ok) throw new Error('Server error ' + res.status);

      // Streaming — show jobs as they arrive
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream:true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const msg = JSON.parse(line.slice(6));
            if (msg.type === 'job') {
              setJobs(prev => [...prev, msg.job]);
              setLoading(false);
            }
            if (msg.type === 'done') setLoading(false);
            if (msg.type === 'error') setError(msg.message);
          } catch {}
        }
      }
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const visible = activeTab === 'intern' ? jobs.filter(j=>isIntern(j))
    : activeTab === 'ft' ? jobs.filter(j=>!isIntern(j)) : jobs;

  const sorted = sortBy === 'date'
    ? [...visible].sort((a,b)=>(b.posted||'').localeCompare(a.posted||''))
    : visible;

  const counts = { all:jobs.length, ft:jobs.filter(j=>!isIntern(j)).length, intern:jobs.filter(j=>isIntern(j)).length };

  function copyUrl(url, id) {
    navigator.clipboard?.writeText(url).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null), 1800);
  }

  function exportCSV() {
    const headers = ['Title','Company','Location','Type','Sector','Salary','Posted','URL'];
    const rows = jobs.map(j=>[
      '"'+(j.title||'').replace(/"/g,'""')+'"',
      '"'+(j.org||'').replace(/"/g,'""')+'"',
      '"'+(j.location||'').replace(/"/g,'""')+'"',
      j.type||'', j.sector||'', j.salary||'', j.posted||'', j.url||'',
    ].join(','));
    const csv = [headers.join(','),...rows].join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download='phd-jobs.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(14,15,17,.97)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${S.border}`,padding:'0 2rem',height:52,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
          <div style={{display:'flex',gap:'.28rem'}}>
            {[['OR',S.blue,'rgba(79,142,247,.2)'],['ML',S.cyan,'rgba(34,211,238,.15)'],['AI',S.green,'rgba(52,211,153,.15)']].map(([l,c,bg])=>(
              <span key={l} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.67rem',padding:'.17rem .46rem',borderRadius:3,fontWeight:500,background:bg,color:c,border:`1px solid ${c}55`}}>{l}</span>
            ))}
          </div>
          <span style={{fontSize:'.78rem',color:S.muted,fontWeight:300}}>PhD Industry Jobs</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1.2rem'}}>
          <Link href="/companies" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:S.muted,textDecoration:'none',letterSpacing:'.04em',transition:'color .15s'}}
            onMouseOver={e=>e.currentTarget.style.color=S.text} onMouseOut={e=>e.currentTarget.style.color=S.muted}>
            Company Directory →
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'.4rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:S.muted}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:S.green,animation:'blink 2s infinite'}}/>
            LIVE
          </div>
        </div>
      </nav>

      {/* MAIN TABS */}
      <div style={{background:S.surface,borderBottom:`1px solid ${S.border}`,padding:'0 2rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
        {[['jobs','Job Board'],['resources','Resources'],['companies','Company Directory'],['calendar','Recruiting Calendar']].map(([t,label])=>(
          <button key={t} onClick={()=>setMainTab(t)} style={{
            cursor:'pointer', padding:'.9rem 1.5rem',
            fontFamily:"'Sora',sans-serif", fontSize:'.95rem',
            fontWeight: mainTab===t ? 600 : 400,
            color: mainTab===t ? S.text : S.muted,
            background: 'none', border: 'none',
            borderBottom: `3px solid ${mainTab===t ? S.blue : 'transparent'}`,
            transition:'all .15s',
          }}
          onMouseOver={e=>{ if(mainTab!==t) e.currentTarget.style.color=S.dim; }}
          onMouseOut={e=>{ if(mainTab!==t) e.currentTarget.style.color=S.muted; }}>
            {label}
          </button>
        ))}
      </div>

      {/* JOB BOARD TAB */}
      <div style={{display:mainTab==='jobs'?'block':'none'}}>
        <section style={{position:'relative',zIndex:1,padding:'3rem 2rem 2rem',maxWidth:860,margin:'0 auto',textAlign:'center'}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.2em',textTransform:'uppercase',color:S.blue,marginBottom:'1rem'}}>
            Doctoral Level · Industry · United States
          </p>
          <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:'clamp(1.9rem,4.5vw,3rem)',fontWeight:600,lineHeight:1.15,marginBottom:'.9rem',letterSpacing:'-.02em'}}>
            <span style={{color:S.blue}}>Operations Research</span> &times;<br/>
            <span style={{color:S.cyan}}>Machine Learning</span> &times; <span style={{color:S.green}}>AI</span>
          </h1>
          <p style={{color:S.dim,fontSize:'.9rem',fontWeight:300,maxWidth:480,margin:'0 auto 2rem',lineHeight:1.7}}>
            Live job postings pulled directly from employer career pages.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))',gap:'.45rem',maxWidth:820,margin:'0 auto'}}>
            {CATEGORIES.map(cat=>(
              <button key={cat.id} className="cat-btn" onClick={()=>search(cat)}
                style={{background:activeCat===cat.id?cat.bg:S.surface,border:`1px solid ${activeCat===cat.id?cat.border:S.border}`,color:activeCat===cat.id?cat.color:S.dim,padding:'.65rem 1rem',fontFamily:"'Sora',sans-serif",fontSize:'.86rem',fontWeight:activeCat===cat.id?500:400,textAlign:'left',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'space-between',gap:'.4rem'}}>
                <span>{cat.label}</span>
                {activeCat===cat.id && loading && <div style={{width:9,height:9,borderRadius:'50%',border:`1.5px solid ${cat.color}`,borderTopColor:'transparent',animation:'spin .7s linear infinite',flexShrink:0}}/>}
                {activeCat===cat.id && !loading && jobs.length>0 && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',background:cat.bg,padding:'.06rem .32rem',borderRadius:8,flexShrink:0}}>{jobs.length}</span>}
              </button>
            ))}
          </div>
        </section>

        {/* TABS BAR */}
        {jobs.length > 0 && (
          <div style={{position:'sticky',top:52,zIndex:90,background:'rgba(14,15,17,.97)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${S.border}`,display:'flex',alignItems:'center',padding:'0 2rem'}}>
            {[['all','All'],['ft','Full-Time'],['intern','Internships']].map(([t,label],i)=>(
              <div key={t} style={{display:'flex',alignItems:'center'}}>
                {i>0 && <div style={{width:1,height:17,background:S.border,margin:'0 .15rem'}}/>}
                <button onClick={()=>setActiveTab(t)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.66rem',letterSpacing:'.08em',textTransform:'uppercase',padding:'0 1.15rem',height:42,display:'flex',alignItems:'center',gap:'.38rem',color:activeTab===t?S.blue:S.muted,cursor:'pointer',transition:'all .15s',background:'none',border:'none',borderBottom:`2px solid ${activeTab===t?S.blue:'transparent'}`}}>
                  {label}
                  <span style={{background:activeTab===t?'rgba(79,142,247,.15)':S.surface2,border:`1px solid ${activeTab===t?'rgba(79,142,247,.3)':S.border2}`,color:activeTab===t?S.blue:S.muted,padding:'.07rem .38rem',borderRadius:10,fontSize:'.57rem'}}>{counts[t]||0}</span>
                </button>
              </div>
            ))}
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'.6rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.3rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:S.muted}}>
                <span>Sort:</span>
                {[['relevance','Relevance'],['date','Date']].map(([v,l])=>(
                  <button key={v} onClick={()=>setSortBy(v)} style={{background:sortBy===v?S.surface2:'none',border:`1px solid ${sortBy===v?S.border2:'transparent'}`,color:sortBy===v?S.text:S.muted,padding:'.2rem .55rem',borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',cursor:'pointer',transition:'all .15s'}}>{l}</button>
                ))}
              </div>
              <button onClick={exportCSV} style={{background:'none',border:`1px solid ${S.border2}`,color:S.muted,padding:'.2rem .65rem',borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',cursor:'pointer',transition:'all .15s'}}
                onMouseOver={e=>{e.currentTarget.style.color=S.text;e.currentTarget.style.borderColor=S.text}}
                onMouseOut={e=>{e.currentTarget.style.color=S.muted;e.currentTarget.style.borderColor=S.border2}}>
                Export CSV
              </button>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:S.muted}}>{jobs.length} results</span>
            </div>
          </div>
        )}

        {/* RESULTS */}
        <div style={{maxWidth:1060,margin:'0 auto',padding:'1.6rem 2rem'}}>
          {!activeCat && (
            <div>
              <div style={{textAlign:'center',padding:'2rem 2rem 1.5rem',color:S.muted}}>
                <p style={{fontSize:'.9rem'}}>Select a category above — or search these companies directly below</p>
              </div>
              {/* Curated Directory */}
              <div style={{borderTop:`1px solid ${S.border}`,paddingTop:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:S.muted}}>Search Directly — Companies We Cannot Pull From</span>
                </div>
                <p style={{fontSize:'.78rem',color:S.muted,marginBottom:'1rem',lineHeight:1.6}}>
                  Google, Amazon, Meta, Jane Street, Two Sigma and others use proprietary hiring systems. Click any link below to search their career pages directly — pre-filtered for research roles.
                </p>
                <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1rem'}}>
                  {['All','Industry','Finance','Consulting','Research Lab','Government'].map(s=>(
                    <button key={s} onClick={()=>setDirFilter(s)}
                      style={{background:dirFilter===s?S.surface2:'none',border:`1px solid ${dirFilter===s?S.border2:S.border}`,color:dirFilter===s?S.text:S.muted,padding:'.25rem .7rem',borderRadius:6,fontFamily:"'Sora',sans-serif",fontSize:'.75rem',cursor:'pointer',transition:'all .15s'}}>
                      {s}
                    </button>
                  ))}
                </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'.5rem'}}>
                  {DIRECTORY.filter(co=>dirFilter==='All'||co.sector===dirFilter).map((co,i)=>(
                    <a key={i} href={co.url} target="_blank" rel="noopener noreferrer"
                      style={{display:'block',background:S.surface,border:`1px solid ${S.border}`,borderRadius:7,padding:'.8rem 1rem',textDecoration:'none',transition:'border-color .15s,transform .15s'}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor=S.border2;e.currentTarget.style.transform='translateY(-1px)'}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.transform='none'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.25rem'}}>
                        <span style={{fontFamily:"'Sora',sans-serif",fontSize:'.85rem',fontWeight:500,color:S.text}}>{co.name}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',padding:'.1rem .4rem',borderRadius:3,background:co.sector==='Finance'?'rgba(251,191,36,.15)':co.sector==='Government'?'rgba(167,139,250,.15)':co.sector==='Consulting'?'rgba(52,211,153,.15)':'rgba(79,142,247,.15)',color:co.sector==='Finance'?S.amber:co.sector==='Government'?'#a78bfa':co.sector==='Consulting'?S.green:S.blue,flexShrink:0}}>{co.sector}</span>
                      </div>
                      <div style={{fontSize:'.74rem',color:S.dim,marginBottom:'.2rem'}}>{co.role}</div>
                      <div style={{fontSize:'.71rem',color:S.muted}}>{co.note}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
          {loading && jobs.length===0 && <div style={{textAlign:'center',padding:'3.5rem 1rem'}}><div className="spinner"/><p style={{color:S.muted,fontSize:'.8rem'}}>Finding positions...</p></div>}
          {error && <div style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.3)',borderRadius:6,padding:'.8rem 1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'#fca5a5',marginBottom:'1rem'}}>{error}</div>}
          {!loading && activeCat && visible.length===0 && jobs.length>0 && <div style={{textAlign:'center',padding:'2.5rem',color:S.muted}}><p style={{fontSize:'.82rem'}}>No {activeTab} results — try switching tabs.</p></div>}

          {sorted.map((j,i)=>{
            const intern = isIntern(j);
            const dc     = domainColor(j.domain);
            const dl     = domainLabel(j.domain);
            const lclr   = j._source==='usajobs'?'rgba(139,92,246,.6)':dc;
            return (
              <div key={j.id||j.url||i} className="card"
                style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:8,padding:'1.1rem 1.4rem',marginBottom:'.6rem',display:'grid',gridTemplateColumns:'1fr auto',gap:'.45rem 1.1rem',alignItems:'start',animationDelay:`${i*.025}s`,transition:'border-color .18s,box-shadow .18s'}}
                onMouseOver={e=>{e.currentTarget.style.borderColor=S.border2;e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,.25)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.boxShadow='none'}}>
                <div>
                  <div style={{display:'flex',gap:'.28rem',flexWrap:'wrap',marginBottom:'.38rem'}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.54rem',padding:'.11rem .38rem',borderRadius:2,letterSpacing:'.07em',textTransform:'uppercase',background:`${dc}22`,color:dc,border:`1px solid ${dc}55`}}>{dl}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.54rem',padding:'.11rem .38rem',borderRadius:2,letterSpacing:'.07em',textTransform:'uppercase',background:intern?'rgba(245,158,11,.12)':'rgba(99,102,241,.12)',color:intern?S.amber:'#818cf8',border:`1px solid ${intern?'rgba(245,158,11,.3)':'rgba(99,102,241,.3)'}`}}>{intern?'Internship':'Full-Time'}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.54rem',padding:'.11rem .38rem',borderRadius:2,letterSpacing:'.07em',textTransform:'uppercase',background:S.surface2,color:S.muted,border:`1px solid ${S.border2}`}}>{j.sector||'Industry'}</span>
                    {j._source==='usajobs'&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.5rem',padding:'.1rem .35rem',borderRadius:2,background:'rgba(139,92,246,.1)',color:'#a78bfa',border:'1px solid rgba(139,92,246,.25)'}}>USAJobs</span>}
                  </div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontSize:'1.08rem',fontWeight:600,lineHeight:1.3,marginBottom:'.14rem',letterSpacing:'-.01em'}}>{j.title}</div>
                  <div style={{fontSize:'.84rem',color:S.muted,marginBottom:'.35rem'}}><strong style={{color:S.dim,fontWeight:500}}>{j.org}</strong> · {j.location}</div>
                  {j.desc&&<div style={{fontSize:'.76rem',color:S.muted,lineHeight:1.5,marginBottom:'.4rem'}}>{j.desc}</div>}
                  {j.tags?.length>0&&(
                    <div style={{display:'flex',flexWrap:'wrap',gap:'.2rem',marginBottom:'.35rem'}}>
                      {j.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.53rem',padding:'.09rem .33rem',border:`1px solid ${S.border2}`,color:S.muted,borderRadius:2}}>{t}</span>)}
                    </div>
                  )}
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.53rem',color:S.muted}}>
                    via {j.source||'Web'} · <a href={j.url} target="_blank" rel="noopener noreferrer" style={{color:S.blue,textDecoration:'none'}}
                      onMouseOver={e=>e.target.style.textDecoration='underline'}
                      onMouseOut={e=>e.target.style.textDecoration='none'}>
                      {j.url&&j.url.length>60?j.url.slice(0,60)+'...':j.url}
                    </a>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'.4rem',minWidth:130}}>
                  {j.salary&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:S.green,textAlign:'right'}}>{j.salary}</div>}
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:S.muted,textAlign:'right'}}>{j.deadline||'See posting'}</div>
                  <a href={j.url} target="_blank" rel="noopener noreferrer"
                    style={{display:'inline-block',background:S.blue,color:'#fff',textDecoration:'none',padding:'.5rem 1.2rem',fontFamily:"'Sora',sans-serif",fontSize:'.84rem',fontWeight:500,borderRadius:5,transition:'opacity .15s',textAlign:'center',whiteSpace:'nowrap'}}
                    onMouseOver={e=>e.target.style.opacity='.85'}
                    onMouseOut={e=>e.target.style.opacity='1'}>
                    Apply
                  </a>
                  <button onClick={()=>copyUrl(j.url,j.id||i)}
                    style={{background:'transparent',border:`1px solid ${copied===(j.id||i)?S.green:S.border2}`,color:copied===(j.id||i)?S.green:S.muted,padding:'.42rem .8rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',cursor:'pointer',borderRadius:5,transition:'all .15s',whiteSpace:'nowrap'}}>
                    {copied===(j.id||i)?'Copied':'Copy link'}
                  </button>
                  {INTERVIEW_NOTES[j.org]&&(
                    <button onClick={()=>setNoteJob(noteJob===j.id?null:j.id)}
                      style={{background:noteJob===j.id?'rgba(167,139,250,.15)':'transparent',border:`1px solid ${noteJob===j.id?'#a78bfa':S.border2}`,color:noteJob===j.id?'#a78bfa':S.muted,padding:'.42rem .8rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',cursor:'pointer',borderRadius:5,transition:'all .15s',whiteSpace:'nowrap'}}>
                      Interview info
                    </button>
                  )}
                </div>
                {noteJob===j.id&&INTERVIEW_NOTES[j.org]&&(
                  <div style={{gridColumn:'1/-1'}}>
                    <InterviewNote note={INTERVIEW_NOTES[j.org]}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RESOURCES TAB */}
      {mainTab==='resources'&&(
        <div style={{maxWidth:920,margin:'0 auto',padding:'2rem 2rem 4rem'}}>
          <div style={{display:'flex',gap:0,marginBottom:'2rem',borderBottom:`1px solid ${S.border}`,overflowX:'auto'}}>
            {Object.entries(RESOURCES).map(([key,r])=>(
              <button key={key} onClick={()=>{setResField(key);setResSpec('all');}}
                style={{background:'none',border:'none',cursor:'pointer',padding:'.75rem 1.3rem',fontFamily:"'Sora',sans-serif",fontSize:'.82rem',fontWeight:resField===key?500:400,color:resField===key?r.color:S.muted,borderBottom:`2px solid ${resField===key?r.color:'transparent'}`,transition:'all .15s',whiteSpace:'nowrap',marginBottom:'-1px'}}>
                {r.label}
              </button>
            ))}
          </div>
          {Object.entries(RESOURCES).map(([key,r])=>resField!==key?null:(
            <div key={key}>
              {r.specializations&&r.specializations.length>0&&(
                <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1.5rem',padding:'.75rem 1rem',background:S.surface,borderRadius:8,border:`1px solid ${S.border}`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:S.muted,letterSpacing:'.08em',textTransform:'uppercase',marginRight:'.3rem',alignSelf:'center'}}>Filter:</span>
                  {r.specializations.map(s=>(
                    <button key={s.key} onClick={()=>setResSpec(s.key)}
                      style={{background:resSpec===s.key?`${r.color}20`:'transparent',border:`1px solid ${resSpec===s.key?r.color:S.border2}`,color:resSpec===s.key?r.color:S.dim,padding:'.3rem .8rem',borderRadius:20,fontFamily:"'Sora',sans-serif",fontSize:'.75rem',fontWeight:resSpec===s.key?500:400,cursor:'pointer',transition:'all .15s'}}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <Section title="Books" color={r.color}>
                {r.books.filter(b=>b.specs.includes(resSpec)).map((b,i)=>(
                  <ResourceCard key={i} title={b.title} sub={b.authors} note={b.note} url={b.url} color={r.color} tag="Book"/>
                ))}
              </Section>
              <Section title="Courses" color={r.color}>
                {r.courses.filter(c=>c.specs.includes(resSpec)).map((c,i)=>(
                  <ResourceCard key={i} title={c.title} sub={c.platform} note={c.note} url={c.url} color={r.color} tag="Course"/>
                ))}
              </Section>
              <Section title="Engineering Articles" color={r.color}>
                {r.articles.filter(a=>a.specs.includes(resSpec)).map((a,i)=>(
                  <ResourceCard key={i} title={a.title} sub={a.authors} note={null} url={a.url} color={r.color} tag="Article"/>
                ))}
              </Section>
              <Section title="Interview Prep" color={r.color}>
                {r.interview.filter(it=>it.specs.includes(resSpec)).map((it,i)=>(
                  <ResourceCard key={i} title={it.title} sub={it.authors||null} note={it.note} url={it.url} color={r.color} tag="Prep"/>
                ))}
              </Section>
            </div>
          ))}
        </div>
      )}

      {/* CALENDAR TAB */}
      {mainTab==='calendar'&&(
        <div style={{maxWidth:960,margin:'0 auto',padding:'2rem 2rem 4rem'}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:S.muted,marginBottom:'1.5rem',lineHeight:1.6}}>
            Typical recruiting timelines based on community data. Dates vary by year — treat as guidance, not guarantees. Apply early.
          </p>
          <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1rem'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:S.muted,alignSelf:'center',marginRight:'.2rem'}}>Sector:</span>
            {[['all','All'],['Industry','Industry'],['Finance','Quant Finance'],['Consulting','Consulting'],['Government','Gov / Labs']].map(([v,l])=>(
              <button key={v} onClick={()=>setCalFilter(v)}
                style={{background:calFilter===v?S.surface2:'none',border:`1px solid ${calFilter===v?S.border2:S.border}`,color:calFilter===v?S.text:S.muted,padding:'.3rem .8rem',borderRadius:6,fontFamily:"'Sora',sans-serif",fontSize:'.78rem',cursor:'pointer',transition:'all .15s'}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:S.muted,alignSelf:'center',marginRight:'.2rem'}}>Type:</span>
            {[['all','All'],['Full-Time','Full-Time'],['Internship','Internships']].map(([v,l])=>(
              <button key={v} onClick={()=>setCalTypeFilter(v)}
                style={{background:calTypeFilter===v?S.surface2:'none',border:`1px solid ${calTypeFilter===v?S.border2:S.border}`,color:calTypeFilter===v?S.text:S.muted,padding:'.3rem .8rem',borderRadius:6,fontFamily:"'Sora',sans-serif",fontSize:'.78rem',cursor:'pointer',transition:'all .15s'}}>
                {l}
              </button>
            ))}
          </div>
          {(()=>{
            const filtered = CALENDAR.filter(r=>(calFilter==='all'||r.sector===calFilter)&&(calTypeFilter==='all'||r.type===calTypeFilter));
            const sectorColors = {'Industry':'#22d3ee','Finance':'#fbbf24','Consulting':'#a78bfa','Government':'#34d399','Research Lab':'#34d399'};
            const grouped = {};
            filtered.forEach(r=>{ if(!grouped[r.sector]) grouped[r.sector]=[]; grouped[r.sector].push(r); });
            return Object.entries(grouped).map(([sec, rows])=>(
              <div key={sec} style={{marginBottom:'2.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem',paddingBottom:'.5rem',borderBottom:`1px solid ${S.border}`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:sectorColors[sec]||S.dim,fontWeight:500}}>{sec}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:S.muted}}>{rows.length} companies</span>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'Sora',sans-serif",fontSize:'.8rem'}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${S.border2}`}}>
                        {['Company','Role','Type','Applications Open','Interviews','Start','Notes'].map(h=>(
                          <th key={h} style={{textAlign:'left',padding:'.5rem .7rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.09em',textTransform:'uppercase',color:S.muted,fontWeight:400,whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r,i)=>(
                        <tr key={i} style={{borderBottom:`1px solid ${S.border}`}}
                          onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,.02)'}
                          onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{padding:'.65rem .7rem',fontWeight:500,whiteSpace:'nowrap'}}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer"
                              style={{color:S.text,textDecoration:'none',borderBottom:`1px dashed ${S.border2}`,paddingBottom:1}}
                              onMouseOver={e=>e.currentTarget.style.color=sectorColors[sec]||S.blue}
                              onMouseOut={e=>e.currentTarget.style.color=S.text}>
                              {r.company}
                            </a>
                          </td>
                          <td style={{padding:'.65rem .7rem',color:S.dim,fontSize:'.74rem'}}>{r.role}</td>
                          <td style={{padding:'.65rem .7rem',whiteSpace:'nowrap'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',padding:'.1rem .38rem',borderRadius:3,background:r.type==='Internship'?'rgba(251,191,36,.1)':'rgba(99,102,241,.1)',color:r.type==='Internship'?S.amber:'#818cf8'}}>{r.type}</span>
                          </td>
                          <td style={{padding:'.65rem .7rem',whiteSpace:'nowrap'}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'#34d399',background:'rgba(52,211,153,.1)',padding:'.12rem .4rem',borderRadius:3}}>{r.openMonth}</span></td>
                          <td style={{padding:'.65rem .7rem',whiteSpace:'nowrap'}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'#fbbf24',background:'rgba(251,191,36,.1)',padding:'.12rem .4rem',borderRadius:3}}>{r.interviewMonth}</span></td>
                          <td style={{padding:'.65rem .7rem',whiteSpace:'nowrap'}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'#4f8ef7',background:'rgba(79,142,247,.1)',padding:'.12rem .4rem',borderRadius:3}}>{r.startMonth}</span></td>
                          <td style={{padding:'.65rem .7rem',color:S.muted,fontSize:'.72rem',lineHeight:1.5,maxWidth:280}}>{r.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* COMPANY DIRECTORY TAB */}
      {mainTab==='companies'&&(()=>{
        const SC2 = {
          'Big Tech':'#4f8ef7','AI Lab':'#22d3ee','Industry / OR':'#34d399',
          'Quant Finance':'#fbbf24','Hedge Fund':'#f59e0b','Biotech / AI':'#f472b6',
          'Consulting':'#a78bfa','Research Lab':'#34d399','Government':'#a78bfa',
          'Logistics / OR':'#4f8ef7','Energy / OR':'#34d399','Defense':'#f87171',
          'Healthcare AI':'#f472b6','Semiconductor':'#22d3ee','Finance / ML':'#fbbf24',
        };
        const allSectors = ['All',...new Set(DIRECTORY.map(c=>c.sector))].sort((a,b)=>a==='All'?-1:a.localeCompare(b));
        const filtered = DIRECTORY.filter(c=>{
          if(compSearch && !c.name.toLowerCase().includes(compSearch.toLowerCase()) && !c.role.toLowerCase().includes(compSearch.toLowerCase())) return false;
          if(compSector!=='All' && c.sector!==compSector) return false;
          if(compVisa && !c.visa) return false;
          if(compType==='Internship' && c.intOpen==='N/A') return false;
          return true;
        });
        const grouped = {};
        filtered.forEach(c=>{ if(!grouped[c.sector]) grouped[c.sector]=[]; grouped[c.sector].push(c); });
        return (
          <div style={{maxWidth:1200,margin:'0 auto',padding:'2rem 2rem 4rem'}}>
            <div style={{marginBottom:'1.5rem'}}>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:'1.6rem',fontWeight:600,marginBottom:'.4rem',letterSpacing:'-.02em'}}>PhD Research Company Directory</h1>
              <p style={{color:S.dim,fontSize:'.9rem'}}>{DIRECTORY.length} companies · recruiting timelines · direct career page links</p>
            </div>

            {/* Filters */}
            <div style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:10,padding:'1.2rem 1.4rem',marginBottom:'1.5rem',display:'flex',flexDirection:'column',gap:'.9rem'}}>
              <input value={compSearch} onChange={e=>setCompSearch(e.target.value)}
                placeholder="Search company name or role..."
                style={{background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:6,padding:'.65rem 1rem',fontFamily:"'Sora',sans-serif",fontSize:'.88rem',color:S.text,outline:'none',width:'100%'}}/>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.35rem',alignItems:'center'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:S.muted,letterSpacing:'.08em',textTransform:'uppercase',marginRight:'.3rem'}}>Sector</span>
                {allSectors.map(s=>(
                  <button key={s} onClick={()=>setCompSector(s)}
                    style={{background:compSector===s?(s==='All'?S.surface2:`${SC2[s]||S.dim}22`):'none',border:`1px solid ${compSector===s?(s==='All'?S.border2:SC2[s]||S.dim):S.border}`,color:compSector===s?(s==='All'?S.text:SC2[s]||S.dim):S.muted,padding:'.3rem .8rem',borderRadius:20,fontFamily:"'Sora',sans-serif",fontSize:'.8rem',cursor:'pointer',transition:'all .15s',whiteSpace:'nowrap'}}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.8rem',alignItems:'center'}}>
                <div style={{display:'flex',gap:'.35rem',alignItems:'center'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:S.muted,letterSpacing:'.08em',textTransform:'uppercase',marginRight:'.3rem'}}>Type</span>
                  {['All','Full-Time','Internship'].map(t=>(
                    <button key={t} onClick={()=>setCompType(t)}
                      style={{background:compType===t?S.surface2:'none',border:`1px solid ${compType===t?S.border2:S.border}`,color:compType===t?S.text:S.muted,padding:'.3rem .8rem',borderRadius:20,fontFamily:"'Sora',sans-serif",fontSize:'.8rem',cursor:'pointer',transition:'all .15s'}}>
                      {t}
                    </button>
                  ))}
                </div>
                <label style={{display:'flex',alignItems:'center',gap:'.4rem',cursor:'pointer',fontFamily:"'Sora',sans-serif",fontSize:'.82rem',color:compVisa?S.green:S.muted}}>
                  <input type="checkbox" checked={compVisa} onChange={e=>setCompVisa(e.target.checked)} style={{accentColor:S.green}}/>
                  Visa sponsorship only
                </label>
                <span style={{marginLeft:'auto',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:S.muted}}>{filtered.length} companies</span>
              </div>
            </div>

            {/* Grouped cards */}
            {Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([sec,companies])=>{
              const clr = SC2[sec]||S.dim;
              return (
                <div key={sec} style={{marginBottom:'2.5rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem',paddingBottom:'.6rem',borderBottom:`1px solid ${S.border}`}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',letterSpacing:'.1em',textTransform:'uppercase',color:clr,fontWeight:500}}>{sec}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:S.muted}}>{companies.length} companies</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'.75rem'}}>
                    {companies.map((co,i)=>(
                      <div key={i} style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:8,padding:'1rem 1.2rem',transition:'border-color .15s,transform .15s'}}
                        onMouseOver={e=>{e.currentTarget.style.borderColor=clr;e.currentTarget.style.transform='translateY(-2px)'}}
                        onMouseOut={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.transform='none'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.5rem'}}>
                          <div>
                            <div style={{fontFamily:"'Sora',sans-serif",fontSize:'1rem',fontWeight:600,color:S.text,marginBottom:'.18rem'}}>{co.name}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:S.muted}}>{co.hq}</div>
                          </div>
                          <div style={{display:'flex',gap:'.3rem',flexDirection:'column',alignItems:'flex-end'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',padding:'.1rem .42rem',borderRadius:3,background:`${clr}20`,color:clr,border:`1px solid ${clr}40`,whiteSpace:'nowrap'}}>{sec}</span>
                            {co.visa&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',padding:'.08rem .38rem',borderRadius:3,background:'rgba(52,211,153,.1)',color:S.green,border:'1px solid rgba(52,211,153,.25)'}}>Visa OK</span>}
                          </div>
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'.25rem',marginBottom:'.75rem'}}>
                          {co.roles.map((r,j)=><span key={j} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',padding:'.1rem .42rem',borderRadius:3,background:S.surface2,color:S.dim,border:`1px solid ${S.border2}`}}>{r}</span>)}
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',marginBottom:'.75rem'}}>
                          <div style={{background:'rgba(79,142,247,.06)',border:'1px solid rgba(79,142,247,.2)',borderRadius:6,padding:'.5rem .65rem'}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:S.blue,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.35rem'}}>Full-Time</div>
                            <div style={{fontSize:'.76rem',color:S.muted,lineHeight:1.7}}>
                              <span style={{color:S.dim}}>Apply:</span> {co.ftOpen}<br/>
                              <span style={{color:S.dim}}>Interview:</span> {co.ftInterview}<br/>
                              <span style={{color:S.dim}}>Start:</span> {co.ftStart}
                            </div>
                          </div>
                          <div style={{background:co.intOpen==='N/A'?'none':'rgba(251,191,36,.06)',border:`1px solid ${co.intOpen==='N/A'?S.border:'rgba(251,191,36,.2)'}`,borderRadius:6,padding:'.5rem .65rem'}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:co.intOpen==='N/A'?S.muted:S.amber,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.35rem'}}>Internship</div>
                            {co.intOpen==='N/A'
                              ?<div style={{fontSize:'.76rem',color:S.muted}}>Not offered</div>
                              :<div style={{fontSize:'.76rem',color:S.muted,lineHeight:1.7}}>
                                <span style={{color:S.dim}}>Apply:</span> {co.intOpen}<br/>
                                <span style={{color:S.dim}}>Interview:</span> {co.intInterview}<br/>
                                <span style={{color:S.dim}}>Start:</span> {co.intStart}
                              </div>
                            }
                          </div>
                        </div>
                        {co.notes&&<div style={{fontSize:'.78rem',color:S.muted,lineHeight:1.55,marginBottom:'.75rem',padding:'.4rem .6rem',background:S.surface2,borderRadius:5,borderLeft:`2px solid ${clr}60`}}>{co.notes}</div>}
                        <a href={co.url} target="_blank" rel="noopener noreferrer"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.4rem',background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:5,padding:'.45rem .8rem',textDecoration:'none',fontFamily:"'Sora',sans-serif",fontSize:'.82rem',fontWeight:500,color:S.dim,transition:'all .15s'}}
                          onMouseOver={e=>{e.currentTarget.style.background=`${clr}15`;e.currentTarget.style.borderColor=clr;e.currentTarget.style.color=clr;}}
                          onMouseOut={e=>{e.currentTarget.style.background=S.surface2;e.currentTarget.style.borderColor=S.border2;e.currentTarget.style.color=S.dim;}}>
                          View open roles →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {filtered.length===0&&<div style={{textAlign:'center',padding:'4rem',color:S.muted}}><p style={{fontSize:'1rem'}}>No companies match your filters</p></div>}
          </div>
        );
      })()}

      <footer style={{borderTop:`1px solid ${S.border}`,padding:'1.5rem 2rem',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:S.muted,letterSpacing:'.07em',marginTop:'1rem'}}>
        <div style={{marginBottom:'.5rem'}}>
          <span style={{color:S.blue}}>OR x ML x AI PhD Board</span> · Greenhouse API · Lever API · Ashby API · USAJobs.gov · 2026
        </div>
        <div style={{fontSize:'.55rem',opacity:.7}}>
          All listings link directly to employer pages. Employer or recruiter? <a href="mailto:takedown@yourdomain.com" style={{color:S.dim,textDecoration:'none'}}>Request removal</a>
        </div>
      </footer>
    </>
  );
}
