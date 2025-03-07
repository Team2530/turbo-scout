package team2530.turbo_discord;

public class Team {
    private final int team_number;
    private final String nickname;

    public Team(int number, String nickname) {
        this.team_number = number;
        this.nickname = nickname; 
    }

    public String getNickname() {
        return nickname;
    }

    public int getTeamNumber()  { 
        return this.team_number;
    }
}
