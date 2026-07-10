from typing import List, Dict

# In-memory mock database for tournament state
# In production, this would be backed by PostgreSQL or Redis.

class TournamentState:
    def __init__(self):
        # Initial 8 teams (Quarterfinals scenario)
        self.teams = {
            "France": {"status": "ACTIVE", "elo": 2100, "flag": "🇫🇷"},
            "Spain": {"status": "ACTIVE", "elo": 2050, "flag": "🇪🇸"},
            "Argentina": {"status": "ACTIVE", "elo": 2080, "flag": "🇦🇷"},
            "England": {"status": "ACTIVE", "elo": 2020, "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
            "Brazil": {"status": "ACTIVE", "elo": 2090, "flag": "🇧🇷"},
            "Portugal": {"status": "ACTIVE", "elo": 2000, "flag": "🇵🇹"},
            "Germany": {"status": "ACTIVE", "elo": 1980, "flag": "🇩🇪"},
            "Netherlands": {"status": "ACTIVE", "elo": 1950, "flag": "🇳🇱"},
        }

    def get_active_teams(self) -> List[Dict]:
        """Returns a list of teams that are still alive."""
        active = []
        for name, data in self.teams.items():
            if data["status"] == "ACTIVE":
                active.append({"name": name, **data})
        return active

    def eliminate_team(self, team_name: str) -> bool:
        """Marks a team as ELIMINATED."""
        if team_name in self.teams and self.teams[team_name]["status"] == "ACTIVE":
            self.teams[team_name]["status"] = "ELIMINATED"
            return True
        return False

    def is_active(self, team_name: str) -> bool:
        """Checks if a team is active."""
        if team_name in self.teams:
            return self.teams[team_name]["status"] == "ACTIVE"
        return False

# Global singleton for FastAPI
state = TournamentState()
