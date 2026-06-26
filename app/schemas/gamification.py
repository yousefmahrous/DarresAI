from pydantic import BaseModel

class LeaderboardUser(BaseModel):
    rank: int
    name: str
    points: int

    class Config:
        from_attributes = True