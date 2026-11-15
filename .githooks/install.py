"""Enable this repository's hooks on local installs."""
import os
import subprocess
from pathlib import Path

if not os.environ.get("CI") and Path(".git").exists():
    get = subprocess.run(["git", "config", "--get", "core.hooksPath"], capture_output=True)
    if get.returncode not in (0, 1):
        raise SystemExit("Не удалось прочитать настройки Git.")
    if get.returncode == 0 and get.stdout.rstrip() != b".githooks":
        raise SystemExit("Уже задан core.hooksPath. Подключите хуки проекта в текущей цепочке хуков.")
    hooks = Path(subprocess.check_output(["git", "rev-parse", "--git-path", "hooks"]).decode().strip())
    if get.returncode == 1 and hooks.is_dir() and any(
        p.is_file() and os.access(p, os.X_OK) and not p.name.endswith(".sample") for p in hooks.iterdir()
    ):
        raise SystemExit("Обнаружены локальные хуки Git. Подключите хуки проекта в текущей цепочке хуков.")
    subprocess.run(["git", "config", "--local", "core.hooksPath", ".githooks"], check=True)
