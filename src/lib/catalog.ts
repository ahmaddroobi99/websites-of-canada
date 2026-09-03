import { mulberry32 } from "./utils";

export const WORLD_W = 11000;
export const WORLD_H = 6800;
export const TILE_W = 168;
export const TILE_H = 108;

export type Category =
  | "seniors-care"
  | "community-nonprofit"
  | "faith-youth"
  | "local-news"
  | "national-news"
  | "newswire"
  | "magazines"
  | "education"
  | "digital-agency"
  | "creative-studio"
  | "photography"
  | "civic-government"
  | "health"
  | "sports"
  | "business"
  | "indigenous"
  | "arts-culture"
  | "environment"
  | "library-archive";

export interface Site {
  id: string;
  host: string;
  url: string;
  title: string;
  tagline: string;
  address?: string;
  category: Category;
  tags: string[];
  years: number[];
  waybackExample?: string;
  x: number;
  y: number;
  color: string;
  accent: string;
  featured?: boolean;
  filler?: boolean;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; fr: string; color: string; accent: string; hx: number; hy: number }
> = {
  "local-news": { label: "Local news", fr: "Nouvelles locales", color: "#dbe4f0", accent: "#1d4e89", hx: 0.48, hy: 0.38 },
  "national-news": { label: "National news", fr: "Nouvelles nationales", color: "#e8eef6", accent: "#12325c", hx: 0.62, hy: 0.32 },
  newswire: { label: "Newswire", fr: "Fil de presse", color: "#c0392b", accent: "#7b1113", hx: 0.36, hy: 0.46 },
  magazines: { label: "Magazines", fr: "Revues", color: "#f4efe4", accent: "#8a5a2b", hx: 0.28, hy: 0.3 },
  "digital-agency": { label: "Digital agencies", fr: "Agences numériques", color: "#12141c", accent: "#6c7cff", hx: 0.55, hy: 0.16 },
  "creative-studio": { label: "Creative studios", fr: "Studios créatifs", color: "#1a1024", accent: "#e85d04", hx: 0.7, hy: 0.14 },
  photography: { label: "Photography", fr: "Photographie", color: "#111111", accent: "#f2f2f2", hx: 0.42, hy: 0.78 },
  "seniors-care": { label: "Seniors", fr: "Aînés", color: "#d7e8f7", accent: "#2b6cb0", hx: 0.18, hy: 0.62 },
  health: { label: "Health", fr: "Santé", color: "#e6f4ea", accent: "#2f6f4e", hx: 0.12, hy: 0.48 },
  "faith-youth": { label: "Faith & youth", fr: "Foi et jeunesse", color: "#f4f1e8", accent: "#c2410c", hx: 0.8, hy: 0.55 },
  education: { label: "Education", fr: "Éducation", color: "#0f2744", accent: "#d4a017", hx: 0.78, hy: 0.28 },
  "civic-government": { label: "Civic", fr: "Civique", color: "#e11d2e", accent: "#fff", hx: 0.22, hy: 0.16 },
  "community-nonprofit": { label: "Community", fr: "Communautaire", color: "#eef6ff", accent: "#2563eb", hx: 0.32, hy: 0.64 },
  indigenous: { label: "Indigenous", fr: "Autochtones", color: "#1c1917", accent: "#eab308", hx: 0.1, hy: 0.28 },
  "arts-culture": { label: "Arts", fr: "Arts", color: "#2b1240", accent: "#f5d0fe", hx: 0.88, hy: 0.42 },
  sports: { label: "Sports", fr: "Sports", color: "#111827", accent: "#ef4444", hx: 0.88, hy: 0.7 },
  business: { label: "Business", fr: "Affaires", color: "#0b1220", accent: "#38bdf8", hx: 0.64, hy: 0.68 },
  environment: { label: "Environment", fr: "Environnement", color: "#052e16", accent: "#86efac", hx: 0.08, hy: 0.78 },
  "library-archive": { label: "Libraries", fr: "Bibliothèques", color: "#111827", accent: "#93c5fd", hx: 0.5, hy: 0.9 },
};

export const ADJACENT: Record<Category, Category[]> = {
  "local-news": ["national-news", "newswire", "magazines", "civic-government"],
  "national-news": ["local-news", "newswire", "magazines"],
  newswire: ["local-news", "national-news", "civic-government", "business"],
  magazines: ["local-news", "arts-culture", "photography"],
  "digital-agency": ["creative-studio", "business", "photography"],
  "creative-studio": ["digital-agency", "arts-culture", "photography"],
  photography: ["creative-studio", "arts-culture", "magazines"],
  "seniors-care": ["health", "community-nonprofit"],
  health: ["seniors-care", "community-nonprofit", "education"],
  "faith-youth": ["community-nonprofit", "education", "arts-culture"],
  education: ["library-archive", "faith-youth", "arts-culture"],
  "civic-government": ["library-archive", "newswire", "community-nonprofit"],
  "community-nonprofit": ["seniors-care", "faith-youth", "civic-government"],
  indigenous: ["arts-culture", "civic-government", "environment"],
  "arts-culture": ["photography", "education", "indigenous"],
  sports: ["local-news", "business", "community-nonprofit"],
  business: ["digital-agency", "newswire", "sports"],
  environment: ["indigenous", "community-nonprofit", "health"],
  "library-archive": ["education", "civic-government", "arts-culture"],
};

type Seed = {
  id: string;
  host: string;
  title: string;
  tagline: string;
  category: Category;
  years: number[];
  tags: string[];
  address?: string;
  waybackExample?: string;
};

const SEEDS: Seed[] = [
  {
    id: "nepean",
    host: "nepeanseniors.ca",
    title: "Nepean Seniors' Home Support",
    tagline: "Help for seniors who want to remain independent",
    address: "3865 Richmond Road, Nepean ON K2H 5C1",
    category: "seniors-care",
    years: [2001, 2002, 2003, 2004, 2005, 2008],
    tags: ["seniors", "ottawa", "home-support", "nonprofit"],
    waybackExample: "https://web.archive.org/web/20010722232220/http://nepeanseniors.ca/",
  },
  {
    id: "buildjyn",
    host: "buildjyn.ca",
    title: "Jewish Youth Network",
    tagline: "Miriam and Larry Robbins Centre for Jewish Youth",
    category: "faith-youth",
    years: [2017, 2020, 2021, 2025],
    tags: ["youth", "jewish", "community", "toronto"],
    waybackExample: "https://web.archive.org/web/20170706035845/http://buildjyn.ca/",
  },
  {
    id: "mtltimes",
    host: "mtltimes.ca",
    title: "Montreal Times",
    tagline: "Montreal entertainment, news, and social life",
    category: "local-news",
    years: [2012, 2016, 2021, 2023],
    tags: ["montreal", "news", "betty-white"],
  },
  {
    id: "newswirebc",
    host: "newswirebc.ca",
    title: "NewsWire BC",
    tagline: "We deliver news releases to media in BC and across Canada",
    category: "newswire",
    years: [2008, 2014, 2019, 2022],
    tags: ["bc", "press", "media"],
  },
  {
    id: "newsrooms",
    host: "newsrooms.ca",
    title: "Newsrooms",
    tagline: "Canadian and world news desks",
    category: "newswire",
    years: [2006, 2011, 2018],
    tags: ["newsroom", "canada"],
  },
  {
    id: "larevue",
    host: "larevue.qc.ca",
    title: "La Revue",
    tagline: "À la une — actualité du Québec",
    category: "magazines",
    years: [2004, 2010, 2017, 2021],
    tags: ["quebec", "francophone"],
  },
  {
    id: "lamauricie",
    host: "lamauricie.qc.ca",
    title: "La Mauricie",
    tagline: "Mauricie en ligne — organismes et films",
    category: "local-news",
    years: [2005, 2012, 2019],
    tags: ["mauricie", "quebec"],
  },
  {
    id: "knopka",
    host: "news.knopka.ca",
    title: "Knopka News",
    tagline: "Community newsroom",
    category: "local-news",
    years: [2015, 2019, 2024],
    tags: ["community", "news"],
  },
  {
    id: "netia",
    host: "netia.ca",
    title: "Netia",
    tagline: "Amplify your story — news and press releases",
    category: "newswire",
    years: [2009, 2016, 2022],
    tags: ["cision", "pr"],
  },
  {
    id: "cision",
    host: "cision.ca",
    title: "Cision Canada",
    tagline: "News & press releases · today's top stories",
    category: "newswire",
    years: [2003, 2010, 2018, 2024],
    tags: ["pr", "wire"],
  },
  {
    id: "nubee",
    host: "nubee.ca",
    title: "nubee",
    tagline: "stratégie + web + design",
    category: "digital-agency",
    years: [2014, 2018, 2023],
    tags: ["agency", "web"],
  },
  {
    id: "tactic",
    host: "tacticcreative.ca",
    title: "Tactic Creative Studios",
    tagline: "Find your audiences",
    category: "creative-studio",
    years: [2016, 2020, 2024],
    tags: ["studio", "brand"],
  },
  {
    id: "paradigm",
    host: "paradigmgroup.ca",
    title: "Paradigm",
    tagline: "Power of radio · digital live social collabs",
    category: "digital-agency",
    years: [2011, 2017, 2022],
    tags: ["radio", "pr"],
  },
  {
    id: "photos",
    host: "photos.ca",
    title: "Show My Photos",
    tagline: "Sell photos to your customers worldwide, 24 hours a day",
    category: "photography",
    years: [2002, 2007, 2013, 2019],
    tags: ["stock", "photos"],
  },
  {
    id: "stock",
    host: "istock.ca",
    title: "Community Stock Photography",
    tagline: "Canadian stock and assignment photography",
    category: "photography",
    years: [2004, 2011, 2018],
    tags: ["stock"],
  },
  {
    id: "epris",
    host: "epris.uqam.ca",
    title: "ÉPRIS · UQAM",
    tagline: "Research and Jewish studies at UQAM",
    category: "education",
    years: [2008, 2015, 2022],
    tags: ["uqam", "montreal"],
  },
  {
    id: "hflashuk",
    host: "hflashuk.ca",
    title: "HFLA Shuk",
    tagline: "Sip, snack & shop in support of HFLA & Jewish business",
    category: "community-nonprofit",
    years: [2019, 2023, 2025],
    tags: ["vancouver", "jewish", "market"],
  },
  {
    id: "hillel",
    host: "hillel.ca",
    title: "Hillel Canada",
    tagline: "Jewish student life on campus",
    category: "faith-youth",
    years: [2006, 2014, 2021],
    tags: ["campus", "youth"],
  },
  {
    id: "cbc",
    host: "cbc.ca",
    title: "CBC",
    tagline: "Canada's public broadcaster",
    category: "national-news",
    years: [1996, 2001, 2008, 2015, 2022],
    tags: ["broadcast", "news"],
  },
  {
    id: "radcan",
    host: "radio-canada.ca",
    title: "Radio-Canada",
    tagline: "Ici Radio-Canada — info, culture, sports",
    category: "national-news",
    years: [1998, 2006, 2014, 2023],
    tags: ["francophone", "broadcast"],
  },
  {
    id: "thetyee",
    host: "thetyee.ca",
    title: "The Tyee",
    tagline: "Independent BC news and ideas",
    category: "local-news",
    years: [2003, 2010, 2018, 2024],
    tags: ["bc", "independent"],
  },
  {
    id: "rabble",
    host: "rabble.ca",
    title: "rabble.ca",
    tagline: "News for the rest of us",
    category: "magazines",
    years: [2001, 2009, 2016],
    tags: ["progressive", "canada"],
  },
  {
    id: "canada",
    host: "canada.ca",
    title: "Government of Canada",
    tagline: "Services and information for Canadians",
    category: "civic-government",
    years: [2013, 2017, 2021, 2025],
    tags: ["federal", "services"],
  },
  {
    id: "gc",
    host: "gc.ca",
    title: "Government of Canada (classic)",
    tagline: "The early federal web",
    category: "civic-government",
    years: [1995, 2001, 2006, 2012],
    tags: ["federal", "classic"],
  },
  {
    id: "vancouver",
    host: "vancouver.ca",
    title: "City of Vancouver",
    tagline: "City services, parks, and civic life",
    category: "civic-government",
    years: [1998, 2005, 2012, 2020],
    tags: ["vancouver", "city"],
  },
  {
    id: "toronto",
    host: "toronto.ca",
    title: "City of Toronto",
    tagline: "The city of Toronto official site",
    category: "civic-government",
    years: [1999, 2007, 2015, 2023],
    tags: ["toronto"],
  },
  {
    id: "ubc",
    host: "ubc.ca",
    title: "University of British Columbia",
    tagline: "A place of mind",
    category: "education",
    years: [1996, 2004, 2012, 2020],
    tags: ["university", "vancouver"],
  },
  {
    id: "sfu",
    host: "sfu.ca",
    title: "Simon Fraser University",
    tagline: "Canada's engaged university",
    category: "education",
    years: [1997, 2005, 2013, 2021],
    tags: ["university", "burnaby"],
  },
  {
    id: "mcgill",
    host: "mcgill.ca",
    title: "McGill University",
    tagline: "Montreal's research university",
    category: "education",
    years: [1996, 2003, 2011, 2019],
    tags: ["montreal", "university"],
  },
  {
    id: "uottawa",
    host: "uottawa.ca",
    title: "University of Ottawa",
    tagline: "Canada's university",
    category: "education",
    years: [1998, 2006, 2014, 2022],
    tags: ["ottawa", "bilingual"],
  },
  {
    id: "nfb",
    host: "nfb.ca",
    title: "National Film Board",
    tagline: "Watch documentaries, animation, and interactive works",
    category: "arts-culture",
    years: [1996, 2005, 2013, 2021],
    tags: ["film", "culture"],
  },
  {
    id: "banff",
    host: "banffcentre.ca",
    title: "Banff Centre",
    tagline: "Arts, leadership, and mountain culture",
    category: "arts-culture",
    years: [1999, 2008, 2016, 2023],
    tags: ["alberta", "arts"],
  },
  {
    id: "vpl",
    host: "vpl.ca",
    title: "Vancouver Public Library",
    tagline: "Inspiration, connection, community",
    category: "library-archive",
    years: [1997, 2006, 2014, 2024],
    tags: ["library", "vancouver", "kiosk"],
  },
  {
    id: "bac",
    host: "bac-lac.gc.ca",
    title: "Library and Archives Canada",
    tagline: "Preserve the documentary heritage of Canada",
    category: "library-archive",
    years: [2004, 2011, 2018, 2024],
    tags: ["archives", "federal"],
  },
  {
    id: "archivecan",
    host: "internetarchivecanada.org",
    title: "Internet Archive Canada",
    tagline: "Explore 30 years of the Canadian web",
    category: "library-archive",
    years: [2016, 2020, 2024, 2026],
    tags: ["wayback", "archive"],
  },
  {
    id: "canadiansport",
    host: "olympic.ca",
    title: "Canadian Olympic Committee",
    tagline: "Helping Canadian athletes win",
    category: "sports",
    years: [2000, 2010, 2018, 2024],
    tags: ["olympics"],
  },
  {
    id: "hockey",
    host: "hockeycanada.ca",
    title: "Hockey Canada",
    tagline: "Our game",
    category: "sports",
    years: [1998, 2006, 2014, 2022],
    tags: ["hockey"],
  },
  {
    id: "canucks",
    host: "canucks.com",
    title: "Vancouver Canucks",
    tagline: "We are all Canucks",
    category: "sports",
    years: [1999, 2007, 2015, 2023],
    tags: ["nhl", "vancouver"],
  },
  {
    id: "indigenous",
    host: "ictinc.ca",
    title: "Indigenous Corporate Training",
    tagline: "Working effectively with Indigenous Peoples",
    category: "indigenous",
    years: [2005, 2012, 2019],
    tags: ["training"],
  },
  {
    id: "aptn",
    host: "aptn.ca",
    title: "APTN",
    tagline: "Aboriginal Peoples Television Network",
    category: "indigenous",
    years: [1999, 2008, 2016, 2024],
    tags: ["broadcast", "indigenous"],
  },
  {
    id: "davidsuzuki",
    host: "davidsuzuki.org",
    title: "David Suzuki Foundation",
    tagline: "Solutions for a living planet",
    category: "environment",
    years: [1997, 2006, 2014, 2022],
    tags: ["climate", "nature"],
  },
  {
    id: "natureconservancy",
    host: "natureconservancy.ca",
    title: "Nature Conservancy of Canada",
    tagline: "Protecting Canada's natural spaces",
    category: "environment",
    years: [2001, 2009, 2017, 2024],
    tags: ["conservation"],
  },
  {
    id: "sickkids",
    host: "sickkids.ca",
    title: "SickKids",
    tagline: "Healthier children. A better world.",
    category: "health",
    years: [1998, 2007, 2015, 2023],
    tags: ["hospital", "toronto"],
  },
  {
    id: "healthcan",
    host: "healthycanadians.gc.ca",
    title: "Healthy Canadians",
    tagline: "Health information from the Government of Canada",
    category: "health",
    years: [2008, 2013, 2018],
    tags: ["federal", "health"],
  },
  {
    id: "shopify",
    host: "shopify.ca",
    title: "Shopify",
    tagline: "The commerce platform built in Ottawa",
    category: "business",
    years: [2006, 2012, 2018, 2024],
    tags: ["ottawa", "commerce"],
  },
  {
    id: "rbc",
    host: "rbc.com",
    title: "RBC",
    tagline: "Royal Bank of Canada",
    category: "business",
    years: [1997, 2005, 2013, 2021],
    tags: ["bank"],
  },
  {
    id: "directory",
    host: "canada411.ca",
    title: "Canada 411",
    tagline: "Find a person or business in Canada",
    category: "business",
    years: [1999, 2006, 2012, 2018],
    tags: ["directory"],
  },
  {
    id: "yellowpages",
    host: "yellowpages.ca",
    title: "Yellow Pages",
    tagline: "Find local businesses across Canada",
    category: "business",
    years: [2000, 2008, 2016, 2023],
    tags: ["directory"],
  },
  {
    id: "tvo",
    host: "tvo.org",
    title: "TVO",
    tagline: "Current affairs and documentaries",
    category: "national-news",
    years: [1998, 2007, 2015, 2023],
    tags: ["ontario", "broadcast"],
  },
  {
    id: "cpac",
    host: "cpac.ca",
    title: "CPAC",
    tagline: "The Cable Public Affairs Channel",
    category: "civic-government",
    years: [1996, 2004, 2012, 2020],
    tags: ["parliament"],
  },
  {
    id: "statcan",
    host: "statcan.gc.ca",
    title: "Statistics Canada",
    tagline: "Canada's national statistical agency",
    category: "civic-government",
    years: [1996, 2004, 2012, 2021],
    tags: ["data"],
  },
  {
    id: "canadapost",
    host: "canadapost.ca",
    title: "Canada Post",
    tagline: "Shipping, tracking, and postal services",
    category: "civic-government",
    years: [1997, 2005, 2013, 2022],
    tags: ["postal"],
  },
  {
    id: "cbcnews",
    host: "cbc.ca",
    title: "CBC News",
    tagline: "Breaking news, Canada, world",
    category: "national-news",
    years: [2000, 2008, 2016, 2024],
    tags: ["news"],
  },
  {
    id: "globalnews",
    host: "globalnews.ca",
    title: "Global News",
    tagline: "National and local news across Canada",
    category: "national-news",
    years: [2009, 2015, 2021],
    tags: ["broadcast"],
  },
  {
    id: "ctv",
    host: "ctvnews.ca",
    title: "CTV News",
    tagline: "Canada's most-watched news network",
    category: "national-news",
    years: [2000, 2008, 2016, 2024],
    tags: ["broadcast"],
  },
  {
    id: "macleans",
    host: "macleans.ca",
    title: "Maclean's",
    tagline: "Canada's national magazine",
    category: "magazines",
    years: [1996, 2005, 2013, 2022],
    tags: ["magazine"],
  },
  {
    id: "walrus",
    host: "thewalrus.ca",
    title: "The Walrus",
    tagline: "Canada's conversation",
    category: "magazines",
    years: [2003, 2011, 2018, 2024],
    tags: ["longform"],
  },
  {
    id: "legacy",
    host: "legacymagazine.ab.ca",
    title: "Legacy Magazine",
    tagline: "Alberta stories, people, and places",
    category: "magazines",
    years: [2004, 2011, 2018],
    tags: ["alberta"],
  },
  {
    id: "donatebooks",
    host: "donatebooks.ca",
    title: "Donate Books",
    tagline: "Keep Canadian books in circulation",
    category: "community-nonprofit",
    years: [2007, 2014, 2020],
    tags: ["books", "literacy"],
  },
  {
    id: "unitedway",
    host: "unitedway.ca",
    title: "United Way",
    tagline: "Local love across Canada",
    category: "community-nonprofit",
    years: [1998, 2006, 2014, 2022],
    tags: ["charity"],
  },
  {
    id: "redcross",
    host: "redcross.ca",
    title: "Canadian Red Cross",
    tagline: "The power of humanity",
    category: "community-nonprofit",
    years: [1997, 2005, 2013, 2021],
    tags: ["emergency"],
  },
  {
    id: "foodbanks",
    host: "foodbankscanada.ca",
    title: "Food Banks Canada",
    tagline: "A Canada where no one goes hungry",
    category: "community-nonprofit",
    years: [2001, 2009, 2017, 2024],
    tags: ["food"],
  },
  {
    id: "canadacouncil",
    host: "canadacouncil.ca",
    title: "Canada Council for the Arts",
    tagline: "Investing in the arts",
    category: "arts-culture",
    years: [1996, 2005, 2014, 2023],
    tags: ["grants", "arts"],
  },
  {
    id: "cmhc",
    host: "cmhc-schl.gc.ca",
    title: "CMHC",
    tagline: "Canada Mortgage and Housing Corporation",
    category: "civic-government",
    years: [1998, 2007, 2016, 2024],
    tags: ["housing"],
  },
  {
    id: "parks",
    host: "pc.gc.ca",
    title: "Parks Canada",
    tagline: "National parks, historic sites, and marine areas",
    category: "environment",
    years: [1997, 2006, 2015, 2023],
    tags: ["parks"],
  },
  {
    id: "via",
    host: "viarail.ca",
    title: "VIA Rail",
    tagline: "Canada's passenger train",
    category: "business",
    years: [1998, 2006, 2014, 2022],
    tags: ["rail"],
  },
  {
    id: "aircanada",
    host: "aircanada.com",
    title: "Air Canada",
    tagline: "Fly the flag",
    category: "business",
    years: [1996, 2004, 2012, 2020],
    tags: ["airline"],
  },
  {
    id: "lululemon",
    host: "lululemon.com",
    title: "lululemon",
    tagline: "From Vancouver to the world",
    category: "business",
    years: [2005, 2011, 2017, 2023],
    tags: ["vancouver", "retail"],
  },
  {
    id: "hootsuite",
    host: "hootsuite.com",
    title: "Hootsuite",
    tagline: "Social media management, born in Vancouver",
    category: "digital-agency",
    years: [2009, 2014, 2019, 2024],
    tags: ["vancouver", "social"],
  },
  {
    id: "slack",
    host: "wealthsimple.com",
    title: "Wealthsimple",
    tagline: "Investing for Canadians",
    category: "business",
    years: [2015, 2018, 2021, 2025],
    tags: ["fintech", "toronto"],
  },
  {
    id: "canadalearning",
    host: "coursera.ca",
    title: "Learning Canada",
    tagline: "Open courses and lifelong learning",
    category: "education",
    years: [2012, 2018, 2023],
    tags: ["learning"],
  },
  {
    id: "seniorscan",
    host: "seniors.gc.ca",
    title: "Seniors Canada",
    tagline: "Programs and services for older Canadians",
    category: "seniors-care",
    years: [2002, 2008, 2014, 2020],
    tags: ["federal", "seniors"],
  },
  {
    id: "carers",
    host: "carerscanada.ca",
    title: "Carers Canada",
    tagline: "Support for family caregivers",
    category: "seniors-care",
    years: [2006, 2013, 2020],
    tags: ["caregivers"],
  },
  {
    id: "helpage",
    host: "helpagecanada.ca",
    title: "HelpAge Canada",
    tagline: "Dignity for older people",
    category: "seniors-care",
    years: [2004, 2011, 2018],
    tags: ["aging"],
  },
];

function place(category: Category, n: number, rand: () => number): { x: number; y: number } {
  const home = CATEGORY_META[category];
  const spreadX = 0.085 + rand() * 0.04;
  const spreadY = 0.07 + rand() * 0.03;
  const ang = rand() * Math.PI * 2;
  const rad = Math.sqrt(rand());
  const x = clamp01(home.hx + Math.cos(ang) * spreadX * rad + (n % 7) * 0.004);
  const y = clamp01(home.hy + Math.sin(ang) * spreadY * rad + ((n * 3) % 5) * 0.003);
  return { x: x * WORLD_W, y: y * WORLD_H };
}

function clamp01(n: number) {
  return Math.max(0.03, Math.min(0.97, n));
}

function yearsAround(rand: () => number): number[] {
  const start = 1996 + Math.floor(rand() * 18);
  const count = 3 + Math.floor(rand() * 4);
  const step = 1 + Math.floor(rand() * 3);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(start + i * step);
  return out;
}

const FILLER_HOSTS: Record<Category, string[]> = {
  "local-news": ["valleyvoice", "harbourpost", "prairierecord", "northstar", "islandgazette", "riverherald"],
  "national-news": ["canadadesk", "nightlynorth", "wirecapital", "briefingcan"],
  newswire: ["presswest", "medianote", "releasehub", "deskline"],
  magazines: ["quarterlynorth", "reviewatlan", "pagesprairie", "almanachqc"],
  "digital-agency": ["pixelnorth", "gridandgo", "launchbay", "signalcraft", "formfound"],
  "creative-studio": ["atelierwest", "studioyvr", "makecolour", "typeandtone"],
  photography: ["framecan", "lenswork", "stillnorth", "exposurelab"],
  "seniors-care": ["homevisit", "eldercircle", "independentliving", "neighbourhelp"],
  health: ["clinicnet", "wellpath", "caremap", "publichealthnote"],
  "faith-youth": ["youthhouse", "campuskehillah", "gatheringplace", "nextgenhub"],
  education: ["collegenorth", "openlecture", "polytechwest", "learncan"],
  "civic-government": ["townhall", "municode", "civicdesk", "bylawnote"],
  "community-nonprofit": ["neighbourtable", "commonsfund", "aidcircle", "localtrust"],
  indigenous: ["nationsvoice", "languagekeep", "treatydesk", "circlework"],
  "arts-culture": ["stagewest", "gallerylane", "poemscan", "festivalhub"],
  sports: ["rinkside", "pitchreport", "clubhousecan", "leaguenote"],
  business: ["tradeboard", "exportnote", "chamberdesk", "startupnorth"],
  environment: ["watershed", "borealnote", "climatehub", "trailkeep"],
  "library-archive": ["branchnotes", "specialcoll", "microfilm", "readingroom"],
};

function buildCatalog(): Site[] {
  const rand = mulberry32(20260902);
  const sites: Site[] = [];

  SEEDS.forEach((seed, i) => {
    const meta = CATEGORY_META[seed.category];
    const pos = place(seed.category, i, rand);
    sites.push({
      ...seed,
      url: seed.host.includes("://") ? seed.host : `http://${seed.host}/`,
      x: pos.x,
      y: pos.y,
      color: meta.color,
      accent: meta.accent,
      featured: true,
    });
  });

  const cats = Object.keys(CATEGORY_META) as Category[];
  let n = 0;
  for (const cat of cats) {
    const names = FILLER_HOSTS[cat];
    const count = 18 + Math.floor(rand() * 8);
    for (let i = 0; i < count; i++) {
      const base = names[i % names.length];
      const host = `${base}${i > names.length - 1 ? i : ""}.ca`;
      const meta = CATEGORY_META[cat];
      const pos = place(cat, 80 + n, rand);
      sites.push({
        id: `f-${cat}-${i}`,
        host,
        url: `http://${host}/`,
        title: base.replace(/-/g, " "),
        tagline: `${meta.label} snapshot from the Canadian web`,
        category: cat,
        tags: [cat, "archive"],
        years: yearsAround(rand),
        x: pos.x,
        y: pos.y,
        color: meta.color,
        accent: meta.accent,
        filler: true,
      });
      n++;
    }
  }

  return sites;
}

export const CATALOG: Site[] = buildCatalog();
export const FEATURED = CATALOG.filter((s) => s.featured);

export const BY_ID = new Map(CATALOG.map((s) => [s.id, s]));
export const BY_HOST = new Map(CATALOG.map((s) => [s.host.replace(/^www\./, ""), s]));

export function searchSites(q: string, limit = 12): Site[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return FEATURED.slice(0, limit);
  const scored = CATALOG.map((s) => {
    const hay = `${s.title} ${s.host} ${s.tagline} ${s.category} ${s.tags.join(" ")} ${s.address ?? ""}`.toLowerCase();
    let score = 0;
    if (s.host.toLowerCase().includes(needle)) score += 8;
    if (s.title.toLowerCase().includes(needle)) score += 6;
    if (s.category.includes(needle)) score += 5;
    if (hay.includes(needle)) score += 2;
    if (s.featured) score += 1;
    return { s, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.s.title.localeCompare(b.s.title));
  return scored.slice(0, limit).map((x) => x.s);
}

export function occupancy(category: Category): number {
  const cluster = CATALOG.filter((s) => s.category === category);
  if (cluster.length < 2) return 0.2;
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const s of cluster) {
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  }
  const area = Math.max(1, (maxX - minX) * (maxY - minY));
  const density = (cluster.length * TILE_W * TILE_H) / area;
  return Math.max(0.05, Math.min(1, density * 1.8));
}

export function categoryOfHost(host: string): Category | null {
  const h = host.replace(/^www\./, "").toLowerCase();
  const hit = BY_HOST.get(h);
  if (hit) return hit.category;
  for (const [key, meta] of Object.entries(CATEGORY_META)) {
    if (h.includes(key.split("-")[0])) return key as Category;
    if (h.includes(meta.label.toLowerCase().slice(0, 5))) return key as Category;
  }
  return null;
}
