from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    DB_HOST    : str = "localhost"
    DB_PORT    : int = 3306
    DB_USER    : str = "root"
    DB_PASSWORD: str = ""
    DB_NAME    : str = "agrolens_ai"

    # JWT
    SECRET_KEY                  : str = "agrolens-secret-key-2026"
    ALGORITHM                   : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 1440  # 24 jam

    # ML Models
    MODEL_DIR: str = "./ml_models/"

    # External APIs
    GROQ_API_KEY: str = ""
    BMKG_API_URL: str = "https://api.bmkg.go.id/publik/prakiraan-cuaca"

    # App
    APP_ENV: str = "development"
    DEBUG  : bool = True

    @property
    def DATABASE_URL(self):
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()