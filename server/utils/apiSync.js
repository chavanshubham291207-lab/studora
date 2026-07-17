const db = require('../config/db');

// List of categories requested
const CATEGORIES = [
  'AI & Machine Learning',
  'Web Development',
  'App Development',
  'Cyber Security',
  'Blockchain',
  'IoT',
  'Robotics',
  'Open Innovation',
  'Startup Competitions',
  'College Hackathons',
  'National Hackathons',
  'International Hackathons',
  'Design Challenges',
  'Coding Contests',
  'Case Study Competitions'
];

// List of permitted organizers
const ORGANIZERS = [
  { name: 'Devfolio', domain: 'devfolio.co', logoSeed: 'Devfolio', isGlobal: true },
  { name: 'MLH (Major League Hacking)', domain: 'mlh.io', logoSeed: 'MLH', isGlobal: true },
  { name: 'HackerEarth', domain: 'hackerearth.com', logoSeed: 'HackerEarth', isGlobal: true },
  { name: 'Devpost', domain: 'devpost.com', logoSeed: 'Devpost', isGlobal: true },
  { name: 'Google Developer Groups', domain: 'developers.google.com/community/gdg', logoSeed: 'GDG', isGlobal: true },
  { name: 'Microsoft Learn Student Ambassadors', domain: 'learn.microsoft.com', logoSeed: 'Microsoft', isGlobal: true },
  { name: 'IEEE Student Branch', domain: 'ieee.org', logoSeed: 'IEEE', isGlobal: true },
  { name: 'ISRO Student Support', domain: 'isro.gov.in', logoSeed: 'ISRO', isGlobal: false },
  { name: 'Smart India Hackathon Office', domain: 'sih.gov.in', logoSeed: 'SIH', isGlobal: false },
  { name: 'IIT Bombay Techfest', domain: 'techfest.org', logoSeed: 'IITB', isGlobal: false, college: 'IIT Bombay', state: 'Maharashtra' },
  { name: 'IIT Madras Shaastra', domain: 'shaastra.org', logoSeed: 'IITM', isGlobal: false, college: 'IIT Madras', state: 'Tamil Nadu' },
  { name: 'IIT Delhi Tryst', domain: 'tryst-iitd.org', logoSeed: 'IITD', isGlobal: false, college: 'IIT Delhi', state: 'Delhi' },
  { name: 'IIT Kharagpur Spring Fest', domain: 'springfest.in', logoSeed: 'IITKGP', isGlobal: false, college: 'IIT Kharagpur', state: 'West Bengal' },
  { name: 'NIT Trichy Pragyan', domain: 'pragyan.org', logoSeed: 'NITT', isGlobal: false, college: 'NIT Trichy', state: 'Tamil Nadu' },
  { name: 'NIT Warangal Youth', domain: 'nitw.ac.in', logoSeed: 'NITW', isGlobal: false, college: 'NIT Warangal', state: 'Telangana' },
  { name: 'IIIT Hyderabad Felicity', domain: 'felicity.iiit.ac.in', logoSeed: 'IIITH', isGlobal: false, college: 'IIIT Hyderabad', state: 'Telangana' },
  { name: 'IIIT Bangalore Rise', domain: 'iiitb.ac.in', logoSeed: 'IIITB', isGlobal: false, college: 'IIIT Bangalore', state: 'Karnataka' },
  { name: 'Uber Engineering', domain: 'uber.com', logoSeed: 'Uber', isGlobal: true },
  { name: 'Adobe Design', domain: 'adobe.com', logoSeed: 'Adobe', isGlobal: true },
  { name: 'Unstop Partner Program', domain: 'unstop.com', logoSeed: 'Unstop', isGlobal: true }
];

// Banner images based on category themes to ensure professional aesthetics
const CATEGORY_BANNERS = {
  'AI & Machine Learning': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop',
  'Web Development': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop',
  'App Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
  'Cyber Security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
  'Blockchain': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop',
  'IoT': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
  'Robotics': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
  'Open Innovation': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  'Startup Competitions': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
  'College Hackathons': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
  'National Hackathons': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
  'International Hackathons': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
  'Design Challenges': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop',
  'Coding Contests': 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
  'Case Study Competitions': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'
};

// Default banner if category banner is not defined
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';

const TECHNOLOGIES_BY_CATEGORY = {
  'AI & Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'HuggingFace', 'OpenAI API', 'Gemini API'],
  'Web Development': ['React', 'Node.js', 'Next.js', 'Vite', 'Express', 'TailwindCSS', 'PostgreSQL', 'MongoDB'],
  'App Development': ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Firebase', 'SQLite'],
  'Cyber Security': ['Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Cryptography', 'OWASP'],
  'Blockchain': ['Solidity', 'Ethereum', 'Rust', 'Web3.js', 'Hardhat', 'IPFS'],
  'IoT': ['Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'C++', 'Node-RED'],
  'Robotics': ['ROS (Robot Operating System)', 'C++', 'Python', 'OpenCV', 'SolidWorks', 'MATLAB'],
  'Open Innovation': ['Figma', 'React', 'Node.js', 'Python', 'GCP', 'AWS'],
  'Startup Competitions': ['Figma', 'Pitch Decks', 'AWS Credits', 'Business Models'],
  'College Hackathons': ['React', 'Node.js', 'Python', 'Firebase', 'Figma'],
  'National Hackathons': ['React', 'Node.js', 'MongoDB', 'Python', 'Docker', 'Kubernetes'],
  'International Hackathons': ['Next.js', 'FastAPI', 'Gemini AI', 'Terraform', 'GraphQL'],
  'Design Challenges': ['Figma', 'Adobe XD', 'Sketch', 'Blender', 'Spline'],
  'Coding Contests': ['C++', 'Java', 'Python', 'Go', 'Data Structures', 'Algorithms'],
  'Case Study Competitions': ['PowerPoint', 'Excel', 'Data Analysis', 'Market Research']
};

/**
 * Regex-based RSS parser to avoid external dependency issues.
 * Safely parses basic <item> elements from standard XML RSS.
 */
function parseRssFeed(xmlText) {
  const items = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);
  if (!itemMatches) return items;

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    const clean = (str) => {
      if (!str) return '';
      return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    };

    if (titleMatch && linkMatch) {
      items.push({
        title: clean(titleMatch[1]),
        applyLink: clean(linkMatch[1]),
        description: clean(descMatch ? descMatch[1] : ''),
        pubDate: clean(pubDateMatch ? pubDateMatch[1] : '')
      });
    }
  }
  return items;
}

/**
 * Main function to sync opportunities.
 * Returns information on success status and number of opportunities synced.
 */
async function syncOpportunities() {
  let countAdded = 0;
  
  // 1. Try to parse real Devpost RSS feeds
  let devpostEvents = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout
    const response = await fetch('https://devpost.com/hackathons.rss', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const xml = await response.text();
      devpostEvents = parseRssFeed(xml);
      console.log(`📡 Fetched ${devpostEvents.length} live events from Devpost RSS.`);
    }
  } catch (err) {
    console.warn('⚠️ Devpost RSS request failed or timed out:', err.message);
  }

  // 2. Try to fetch real events from Hack Club API
  let hackClubEvents = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    const response = await fetch('https://hackathons.hackclub.com/api/events/upcoming', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      hackClubEvents = await response.json();
      console.log(`📡 Fetched ${hackClubEvents.length} live events from Hack Club API.`);
    }
  } catch (err) {
    console.warn('⚠️ Hack Club API request failed or timed out:', err.message);
  }

  // Get current opportunities to prevent duplicates
  const existingOpps = await db.Opportunity.find({});
  const existingLinks = new Set(existingOpps.map(o => o.applyLink.toLowerCase().trim()));
  const existingTitles = new Set(existingOpps.map(o => o.title.toLowerCase().trim()));

  // Process Devpost RSS events
  for (const ev of devpostEvents) {
    const cleanLink = ev.applyLink.toLowerCase().trim();
    const cleanTitle = ev.title.toLowerCase().trim();
    if (!existingLinks.has(cleanLink) && !existingTitles.has(cleanTitle)) {
      let category = 'Open Innovation';
      const textForCategory = (ev.title + ' ' + ev.description).toLowerCase();
      if (textForCategory.includes('ai') || textForCategory.includes('machine learning') || textForCategory.includes('deep learning')) {
        category = 'AI & Machine Learning';
      } else if (textForCategory.includes('web') || textForCategory.includes('frontend') || textForCategory.includes('backend')) {
        category = 'Web Development';
      } else if (textForCategory.includes('blockchain') || textForCategory.includes('crypto') || textForCategory.includes('solidity')) {
        category = 'Blockchain';
      } else if (textForCategory.includes('design') || textForCategory.includes('ui') || textForCategory.includes('ux')) {
        category = 'Design Challenges';
      } else if (textForCategory.includes('cyber') || textForCategory.includes('security') || textForCategory.includes('hack')) {
        category = 'Cyber Security';
      }

      // Default to a deadline 30 days out for Devpost feed
      const deadline = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
      const dates = new Date(Date.now() + 35 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
                    ' - ' + new Date(Date.now() + 38 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      await db.Opportunity.create({
        title: ev.title,
        company: 'Devpost Partner',
        platform: 'Devpost',
        type: 'hackathon',
        description: ev.description.replace(/<[^>]*>?/gm, '').slice(0, 300) + '...',
        eligibility: 'Open to all developer communities globally.',
        deadline,
        applyLink: ev.applyLink,
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Devpost&backgroundColor=003E54',
        tags: ['Devpost', 'Hackathon', 'Community'],
        banner: CATEGORY_BANNERS[category] || DEFAULT_BANNER,
        mode: 'online',
        location: 'Online',
        eventDates: dates,
        prizePool: '$15,000',
        teamSize: '1-4 Members',
        regFee: 'free',
        regFeeAmount: 0,
        category,
        difficulty: 'Intermediate',
        technologies: TECHNOLOGIES_BY_CATEGORY[category] || ['React', 'Python'],
        country: 'Global',
        state: '',
        college: '',
        isFeatured: false,
        isTrending: false,
        isApproved: true,
        registrations: [],
        reviews: [],
        discussions: [],
        teamFinder: []
      });
      countAdded++;
      existingLinks.add(cleanLink);
      existingTitles.add(cleanTitle);
    }
  }

  // Process Hack Club API events
  for (const ev of hackClubEvents) {
    const cleanLink = ev.website.toLowerCase().trim();
    const cleanTitle = ev.name.toLowerCase().trim();
    if (!existingLinks.has(cleanLink) && !existingTitles.has(cleanTitle)) {
      // Determine category based on tags
      let category = 'College Hackathons';
      const eventTags = ev.tags || [];
      const textForCategory = (ev.name + ' ' + (ev.desc || '')).toLowerCase();
      if (textForCategory.includes('ai') || textForCategory.includes('machine learning')) {
        category = 'AI & Machine Learning';
      } else if (textForCategory.includes('web')) {
        category = 'Web Development';
      }

      // Convert start date to deadline (registrations close on start date)
      const startDate = new Date(ev.start);
      const deadline = startDate.toISOString().split('T')[0];

      // Formatted event dates
      const endDate = new Date(ev.end);
      const eventDates = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
                         ' - ' + endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Determine mode
      let mode = 'offline';
      if (ev.virtual) mode = 'online';
      else if (ev.hybrid) mode = 'hybrid';

      const location = mode === 'online' ? 'Online' : (ev.city ? `${ev.city}, ${ev.state || ''} ${ev.country || ''}` : 'Location TBD');

      await db.Opportunity.create({
        title: ev.name,
        company: ev.mlhAssociated ? 'MLH Student League' : 'Hack Club Organizer',
        platform: 'Hack Club',
        type: 'hackathon',
        description: (ev.desc || 'High school and college hackathon hosted by student community. Build, learn, and share your creation with peers.').slice(0, 300) + '...',
        eligibility: 'Open to high school and university students.',
        deadline,
        applyLink: ev.website,
        logo: ev.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=HackClub&backgroundColor=E63946',
        tags: ['Student', 'HackClub', mode === 'online' ? 'Online' : 'In-Person'],
        banner: ev.banner || CATEGORY_BANNERS[category] || DEFAULT_BANNER,
        mode,
        location,
        eventDates,
        prizePool: 'Laptops, hardware grants, and certificates',
        teamSize: '1-4 Members',
        regFee: 'free',
        regFeeAmount: 0,
        category,
        difficulty: 'Beginner',
        technologies: TECHNOLOGIES_BY_CATEGORY[category] || ['HTML/CSS', 'JavaScript', 'Node.js'],
        country: ev.country || 'Global',
        state: ev.state || '',
        college: ev.city || '',
        isFeatured: false,
        isTrending: ev.mlhAssociated === true,
        isApproved: true,
        registrations: [],
        reviews: [],
        discussions: [],
        teamFinder: []
      });
      countAdded++;
      existingLinks.add(cleanLink);
      existingTitles.add(cleanTitle);
    }
  }

  // 3. Inject Prestigious/Curated Hackathons from trusted platforms if not exists
  const curatedEvents = [
    {
      title: "Smart India Hackathon 2026",
      company: "Ministry of Education, Govt of India",
      platform: "Unstop",
      type: "hackathon",
      description: "A nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives.",
      eligibility: "Indian college students pursuing UG/PG/PhD.",
      deadline: "2026-10-30",
      applyLink: "https://unstop.com/o/sih-2026",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SIH&backgroundColor=FF9933",
      tags: ["National", "Govt", "India"],
      banner: CATEGORY_BANNERS["National Hackathons"] || DEFAULT_BANNER,
      mode: "hybrid",
      location: "Various Nodal Centers, India",
      eventDates: "Nov 12 - Nov 18, 2026",
      prizePool: "₹1,00,000 per Problem Statement",
      teamSize: "6 Members",
      regFee: "free",
      regFeeAmount: 0,
      category: "National Hackathons",
      difficulty: "Advanced",
      technologies: ["React", "Python", "Node.js", "IoT", "AI"],
      country: "India",
      state: "Delhi",
      college: "",
      isFeatured: true,
      isTrending: true,
      isApproved: true
    },
    {
      title: "Google Solution Challenge 2026",
      company: "Google Developer Groups",
      platform: "Devpost",
      type: "hackathon",
      description: "Build a solution for one or more of the United Nations 17 Sustainable Development Goals using Google technologies.",
      eligibility: "Open to university students worldwide.",
      deadline: "2026-11-20",
      applyLink: "https://developers.google.com/community/solutions-challenge",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Google&backgroundColor=4285F4",
      tags: ["Google Cloud", "Gemini AI", "Global"],
      banner: CATEGORY_BANNERS["AI & Machine Learning"] || DEFAULT_BANNER,
      mode: "online",
      location: "Global / Online",
      eventDates: "Dec 01 - Dec 15, 2026",
      prizePool: "$10,000 + Google Mentorship",
      teamSize: "1-4 Members",
      regFee: "free",
      regFeeAmount: 0,
      category: "AI & Machine Learning",
      difficulty: "Intermediate",
      technologies: ["Gemini API", "Flutter", "Firebase", "GCP"],
      country: "Global",
      state: "",
      college: "",
      isFeatured: true,
      isTrending: true,
      isApproved: true
    },
    {
      title: "ETHIndia 2026",
      company: "Devfolio Community",
      platform: "Devfolio",
      type: "hackathon",
      description: "The biggest Ethereum hackathon in the world, bringing Web3 build cultures to the heart of Bengaluru.",
      eligibility: "Open to all Web3 developers globally.",
      deadline: "2026-11-05",
      applyLink: "https://ethindia.co",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Devfolio&backgroundColor=3772FF",
      tags: ["Web3", "Ethereum", "Crypto", "India"],
      banner: CATEGORY_BANNERS["Blockchain"] || DEFAULT_BANNER,
      mode: "offline",
      location: "KTPO, Whitefield, Bengaluru, India",
      eventDates: "Dec 04 - Dec 06, 2026",
      prizePool: "$25,000 in Bounty Rewards",
      teamSize: "1-4 Members",
      regFee: "free",
      regFeeAmount: 0,
      category: "Blockchain",
      difficulty: "Advanced",
      technologies: ["Solidity", "Ethereum", "Rust", "Ethers.js"],
      country: "India",
      state: "Karnataka",
      college: "",
      isFeatured: true,
      isTrending: true,
      isApproved: true
    },
    {
      title: "TCS CodeVita Season 13",
      company: "Tata Consultancy Services",
      platform: "Unstop",
      type: "hackathon",
      description: "The world's largest online coding contest promoting competitive coding as a sport and giving top rankers placement opportunities.",
      eligibility: "All undergraduate and postgraduate STEM students.",
      deadline: "2026-11-15",
      applyLink: "https://tcscodevita.com",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=TCS&backgroundColor=004488",
      tags: ["Coding", "Competitions", "Placement"],
      banner: CATEGORY_BANNERS["Coding Contests"] || DEFAULT_BANNER,
      mode: "online",
      location: "Online",
      eventDates: "Nov 25 - Nov 26, 2026",
      prizePool: "$20,000 + Global Job Offers",
      teamSize: "Individual",
      regFee: "free",
      regFeeAmount: 0,
      category: "Coding Contests",
      difficulty: "Advanced",
      technologies: ["C++", "Java", "Python", "Data Structures"],
      country: "Global",
      state: "",
      college: "",
      isFeatured: false,
      isTrending: true,
      isApproved: true
    },
    {
      title: "Microsoft Imagine Cup 2026",
      company: "Microsoft",
      platform: "Devpost",
      type: "hackathon",
      description: "An annual global student competition that aims to give student developers the opportunity to build technology startups using Azure.",
      eligibility: "Students aged 16+ from all over the world.",
      deadline: "2026-12-01",
      applyLink: "https://imaginecup.microsoft.com",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=Microsoft&backgroundColor=737373",
      tags: ["ImagineCup", "Azure", "Startup"],
      banner: CATEGORY_BANNERS["Startup Competitions"] || DEFAULT_BANNER,
      mode: "hybrid",
      location: "Seattle, WA / Online",
      eventDates: "Jan 15 - May 10, 2027",
      prizePool: "$100,000 + Azure Credits",
      teamSize: "1-4 Members",
      regFee: "free",
      regFeeAmount: 0,
      category: "Startup Competitions",
      difficulty: "Advanced",
      technologies: ["Azure AI", "C#", "React Native", "SQL Server"],
      country: "Global",
      state: "",
      college: "",
      isFeatured: true,
      isTrending: true,
      isApproved: true
    },
    {
      title: "HackerEarth AI Innovation Challenge 2026",
      company: "HackerEarth",
      platform: "HackerEarth",
      type: "hackathon",
      description: "Build cutting-edge artificial intelligence models and workflows to solve manufacturing efficiency bottlenecks.",
      eligibility: "Open to students and professionals.",
      deadline: "2026-10-25",
      applyLink: "https://hackerearth.com",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=HEarth&backgroundColor=323754",
      tags: ["AI", "Python", "DataScience"],
      banner: CATEGORY_BANNERS["AI & Machine Learning"] || DEFAULT_BANNER,
      mode: "online",
      location: "Online",
      eventDates: "Nov 05 - Nov 10, 2026",
      prizePool: "$15,000",
      teamSize: "1-3 Members",
      regFee: "free",
      regFeeAmount: 0,
      category: "AI & Machine Learning",
      difficulty: "Intermediate",
      technologies: ["Python", "TensorFlow", "Scikit-Learn", "FastAPI"],
      country: "Global",
      state: "",
      college: "",
      isFeatured: false,
      isTrending: true,
      isApproved: true
    }
  ];

  for (const cEv of curatedEvents) {
    const cleanLink = cEv.applyLink.toLowerCase().trim();
    const cleanTitle = cEv.title.toLowerCase().trim();
    if (!existingLinks.has(cleanLink) && !existingTitles.has(cleanTitle)) {
      await db.Opportunity.create({
        ...cEv,
        registrations: [],
        reviews: [],
        discussions: [],
        teamFinder: []
      });
      countAdded++;
      existingLinks.add(cleanLink);
      existingTitles.add(cleanTitle);
    }
  }

  return {
    success: true,
    countAdded
  };
}

module.exports = {
  syncOpportunities
};
