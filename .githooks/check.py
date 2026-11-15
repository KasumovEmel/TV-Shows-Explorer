"""Scan precisely the Git objects that a commit or push will publish."""
import json
import re
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

from git_objects import git, staged, pushed, write_objects


HERE = Path(__file__).resolve().parent


def scanner_config(folder):
    config = (HERE / "gitleaks.toml").read_text(encoding="utf-8")
    private = Path(git("rev-parse", "--git-common-dir").decode().strip()) / "info/sensitive-values.json"
    if private.exists():
        settings = json.loads(private.read_text(encoding="utf-8"))
        values = settings["values"]
        ports = settings["ports"]
        if not all(isinstance(v, str) and v and "\n" not in v for v in values):
            raise ValueError("invalid private values")
        if not all(type(p) is int and 1 <= p <= 65535 for p in ports):
            raise ValueError("invalid private port")
        # Quote only RE2 metacharacters. JSON strings are valid TOML basic strings.
        literal = [re.sub(r"([\\.^$|?*+(){}\[\]])", r"\\\1", v) for v in values]
        patterns = list(literal)
        for port in ports:
            if port >= 1000:
                patterns.append(r"\b" + str(port) + r"\b")
            else:
                number = str(port)
                patterns.append(
                    r"(?im)(?:^[ \t]*" + number + r"[ \t]*$|"
                    r"(?:\b(?:port|порт)\b[ \t:=]+|(?:^|[ \t])-[pP][ \t]*|"
                    r"\b(?:ssh|sftp)://[^\s/]+:)" + number + r"\b)"
                )
        if patterns:
            config += '\n[[rules]]\nid = "private-infrastructure"\ndescription = "Private infrastructure"\nregex = '
            config += json.dumps("|".join(patterns), ensure_ascii=False) + "\n"
    path = folder / "rules.toml"
    path.write_text(config, encoding="utf-8")
    return path


def main():
    mode = sys.argv[1]
    objects, metadata = set(), []
    if mode == "pre-push":
        pushed(objects, metadata)
    elif mode == "commit-msg":
        metadata.append(Path(sys.argv[2]).read_bytes())
    elif mode == "pre-commit":
        staged(objects, metadata)
        ref = subprocess.run(["git", "symbolic-ref", "-q", "HEAD"], capture_output=True)
        if ref.returncode == 0:
            metadata.append(ref.stdout.rstrip())
    else:
        raise ValueError("unknown hook")
    if not objects and not metadata:
        return
    with TemporaryDirectory(prefix="git-secret-check-") as tmp:
        root = Path(tmp)
        payload = root / "scan"
        payload.mkdir()
        write_objects(sorted(objects), metadata, payload)
        (payload / "metadata").write_bytes(b"\n".join(metadata))
        report = root / "report.json"
        result = subprocess.run([
            "gitleaks", "dir", str(payload), "--config", str(scanner_config(root)),
            "--ignore-gitleaks-allow", "--gitleaks-ignore-path", str(root),
            "--redact=100", "--no-banner", "--max-archive-depth=3",
            "--exit-code=42", "--report-format=json", "--report-path", str(report),
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if result.returncode == 42:
            for hit in json.loads(report.read_text(encoding="utf-8"))[:5]:
                # Paths inside archives may themselves contain secrets.
                oid = re.search(r"(?:^|[/\\])([0-9a-f]{40,64})(?:$|[^0-9a-f])", hit["File"])
                where = "Git-объект " + oid[1][:12] if oid else "имя или сообщение"
                print(f"Git: {hit['RuleID']} ({where}).", file=sys.stderr)
            sys.exit("Операция остановлена. Уберите данные из подготовленных файлов и отправляемой истории.")
        if result.returncode:
            raise RuntimeError("scanner failed")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, IndexError, TypeError, subprocess.SubprocessError, RuntimeError):
        sys.exit("Проверка не выполнена. Проверьте Git, Gitleaks 8.30+ и локальный sensitive-values.json.")
