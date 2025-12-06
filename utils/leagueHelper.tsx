// utils/leagueHelper.ts
export const guessLeague = (teamName: string): string => {
  const name = teamName.toLowerCase();

  if ([
    // All PL teams
    "arsenal", "aston villa", "bournemouth", "brentford", "brighton", 
    "burnley", "chelsea", "crystal palace", "everton", "fulham",
    "liverpool", "luton town", "manchester city", "manchester united", 
    "newcastle united", "nottingham forest", "sheffield united", 
    "tottenham", "west ham", "wolverhampton", "sunderland",
    "leicester city", "leeds united", "southampton", "watford",
    "norwich city", "leeds united", "west brom", "fulham",
    "cardiff city", "huddersfield"
  ].some(t => name.includes(t))) {
    return "Premier League";
  } else if ([
    // All La Liga teams
    "alaves", "almeria", "athletic bilbao", "atletico madrid", "barcelona",
    "betis", "cadiz", "celta vigo", "getafe", "girona",
    "granada", "las palmas", "mallorca", "osasuna", "rayo vallecano",
    "real madrid", "real sociedad", "sevilla", "valencia", "villarreal",
    "real valladolid", "espanyol", "elche", "levante", "deportivo alaves"
  ].some(t => name.includes(t))) {
    return "La Liga";
  } else if ([
    // All Serie A teams
    "atalanta", "bologna", "cagliari", "empoli", "fiorentina",
    "frosinone", "genoa", "inter", "juventus", "lazio",
    "lecce", "milan", "monza", "napoli", "roma",
    "salernitana", "sassuolo", "torino", "udinese", "verona",
    "sampdoria", "cremonese", "spezia", "venezia", "crotone"
  ].some(t => name.includes(t))) {
    return "Serie A";
  } else if ([
    // Current Ligue 1 teams
    "psg", "monaco", "marseille", "rennes", "lille",
    "lyon", "lens", "nice", "reims", "montpellier",
    "toulouse", "lorient", "clermont", "nantes", "strasbourg",
    "le havre", "metz", "brest", "nimes", "ajaccio",
    // Recently relegated teams
    "auxerre", "troyes", "saint-etienne", "bordeaux", "dijon"
  ].some(t => name.includes(t))) {
    return "Ligue 1";
  } else if ([
    // Current Bundesliga teams
    "bayern", "dortmund", "leipzig", "leverkusen", "wolfsburg",
    "eintracht frankfurt", "hoffenheim", "freiburg", "stuttgart", "union berlin",
    "mainz", "augsburg", "werder bremen", "bochum", "gladbach",
    "koln", "heidenheim", "darmstadt", "st. pauli", "hamburg",
    // Recently relegated teams
    "schalke", "hertha berlin", "greuther furth", "arminia bielefeld"
  ].some(t => name.includes(t))) {
    return "Bundesliga";
  } else if ([
    // Current Liga Portugal teams
    "benfica", "porto", "sporting", "braga", "guimaraes",
    "estoril", "arouca", "famalicao", "casa pia", "boavista",
    "vizela", "rio ave", "portimonense", "gil vicente", "estrela",
    "moreirense", "farense", "chaves", "porto b", "varzim",
    // Recently relegated teams
    "maritimo", "pacos ferreira", "santa clara", "tondela"
  ].some(t => name.includes(t))) {
    return "Liga Portugal";
  } else if ([
    // Saudi Pro League teams
    "al nassr", "al hilal", "al ittihad", "al ahli", "al fateh",
    "al taawoun", "al wehda", "al shabab", "al raed", "al taee",
    "al khaleej", "al feiha", "al akhdoud", "al riyadh", "al ettifaq",
    "al khaldiya", "al hazem", "al adalh"
  ].some(t => name.includes(t))) {
    return "SPL";
  } else if ([
    // Current MLS teams (2023)
    "atlanta united", "austin fc", "charlotte fc", "chicago fire", "colorado rapids",
    "columbus crew", "dc united", "fc cincinnati", "fc dallas", "houston dynamo",
    "inter miami", "la galaxy", "los angeles fc", "minnesota united", "cf montreal",
    "nashville sc", "new england revolution", "new york city", "new york red bulls",
    "orlando city", "philadelphia union", "portland timbers", "real salt lake",
    "san jose earthquakes", "seattle sounders", "sporting kansas city", "st. louis city",
    "toronto fc", "vancouver whitecaps"
  ].some(t => name.includes(t))) {
    return "MLS";
  } else {
    return "Unknown";
  }
};
