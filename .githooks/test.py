"""Run with python3 .githooks/test.py; every push goes to a temporary local remote."""
import io
import json
import os
import secrets
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

HOOKS = Path(__file__).resolve().parent


def exercise(root):
    local, remote = root / "local", root / "remote.git"
    local.mkdir()
    env = {**os.environ, "GIT_CONFIG_GLOBAL": os.devnull, "GIT_CONFIG_NOSYSTEM": "1"}
    env.pop("CI", None)
    sensitive = "fixture-" + secrets.token_hex(12)
    token = "ghp_" + secrets.token_hex(18)

    def run(*args, blocked=False):
        r = subprocess.run(args, cwd=local, env=env, capture_output=True)
        assert sensitive.encode() not in r.stderr and token.encode() not in r.stderr
        if blocked:
            assert r.returncode and "Git:".encode() in r.stderr, (args[0:2], r.returncode)
        else:
            assert r.returncode == 0, (args[0:2], r.returncode)
        return r.stdout.strip()

    run("git", "init", "-q", "-b", "main")
    run("git", "init", "--bare", "-q", str(remote))
    run("git", "config", "user.name", "Hook Test")
    run("git", "config", "user.email", "hooks@example.invalid")
    run("git", "remote", "add", "origin", str(remote))
    shutil.copytree(HOOKS, local / ".githooks")
    run("python3", ".githooks/install.py")
    assert run("git", "config", "--local", "--get", "core.hooksPath") == b".githooks"
    (local / ".git/info/sensitive-values.json").write_text(json.dumps({
        "values": [sensitive], "ports": [54329],
    }))
    note = local / "note.txt"
    note.write_text("public text")
    run("git", "add", "note.txt")
    note.write_text(sensitive)
    run("git", "commit", "-qm", "clean staged copy")
    run("git", "push", "-q", "origin", "main")
    run("git", "add", "note.txt")
    note.write_text("public text again")
    run("git", "commit", "-qm", "dirty staged copy", blocked=True)

    for value in [token, "VPN_PORT=" + str(54329), "PASSWORD=" + secrets.token_hex(6)]:
        note.write_text(value)
        run("git", "add", "note.txt")
        run("git", "commit", "-qm", "unsafe content", blocked=True)
    archive = io.BytesIO()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("note", token)
    (local / "fixture.zip").write_bytes(archive.getvalue())
    run("git", "restore", "--staged", "note.txt")
    run("git", "add", "fixture.zip")
    run("git", "commit", "-qm", "archive with token", blocked=True)
    run("git", "restore", "--staged", "fixture.zip")
    (local / ".env").write_text("DUMMY=example")
    run("git", "add", ".env")
    run("git", "commit", "-qm", "private filename", blocked=True)
    run("git", "restore", "--staged", ".env")
    run("git", "commit", "--allow-empty", "-qm", sensitive, blocked=True)

    # Simulate commits from a clone where the hooks were not installed.
    note.write_text(sensitive)
    run("git", "add", "note.txt")
    run("git", "-c", "core.hooksPath=" + os.devnull, "commit", "-qm", "intermediate")
    note.write_text("safe final tree")
    run("git", "add", "note.txt")
    run("git", "commit", "-qm", "remove fixture")
    run("git", "push", "origin", "main", blocked=True)
    run("git", "push", "origin", "HEAD:refs/heads/new", blocked=True)
    run("git", "tag", "-a", "unsafe-tag", "origin/main", "-m", token)
    run("git", "push", "origin", "refs/tags/unsafe-tag", blocked=True)
    run("git", "push", "origin", "origin/main:refs/heads/" + sensitive, blocked=True)
    assert run("git", "ls-remote", "--refs", "origin").split()[1:] == [b"refs/heads/main"]


if __name__ == "__main__":
    with tempfile.TemporaryDirectory() as tmp:
        exercise(Path(tmp))
    print("Verified commit and push hooks against a local Git remote.")
