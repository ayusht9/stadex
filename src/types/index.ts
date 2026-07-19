export interface Match {
  id: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute?: string;
  status: string;
  stadium?: string;
  date?: string;
}

export interface TeamStanding {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

export interface Stadium {
  id: string;
  name_en: string;
  fifa_name: string;
  city_en: string;
  country_en: string;
  capacity: number;
  region: string;
  description: string;
  city_name_en: string;
}
