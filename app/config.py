from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  # project root
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    app_name: str = "Job Tracker API"
    env: str = "dev"
    database_url: str
    secret_key: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()