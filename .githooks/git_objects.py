"""Collect staged and outgoing data from the Git object database."""
import re
import subprocess
import sys

PRIVATE_NAME = re.compile(
    rb"^(?:\.env(?:\..+)?|\.netrc|\.git-credentials|known_hosts(?:\.old)?|sensitive-values\.json|"
    rb"id_(?:rsa|dsa|ecdsa|ed25519)|.+\.(?:ovpn|p12|pfx|key))$", re.I
)


def git(*args, data=None):
    return subprocess.check_output(["git", *args], input=data, stderr=subprocess.DEVNULL)


def check_name(path):
    for name in path.split(b"/"):
        if PRIVATE_NAME.fullmatch(name) and name.lower() not in (
            b".env.example", b".env.sample", b".env.template",
        ):
            sys.exit("Git: обнаружен файл с данными доступа. Проверьте имена подготовленных файлов.")


def staged(objects, metadata):
    changes = git("diff", "--cached", "--raw", "-z", "--no-renames", "--no-abbrev",
                  "--diff-filter=ACMT").split(b"\0")
    for header, path in zip(changes[::2], changes[1::2]):
        check_name(path)
        metadata.append(path)
        _, mode, _, oid, _ = header.split()
        if mode != b"160000":  # Submodule contents live in a separate repository.
            objects.add(oid)


def pushed(objects, metadata):
    tips, bases = set(), set()
    for line in sys.stdin.buffer:
        _, tip, remote_ref, old = line.split()
        if not tip.strip(b"0"):  # Deleting a ref sends no objects.
            continue
        metadata.append(remote_ref)
        tips.add(tip)
        if old.strip(b"0") and subprocess.run(
            ["git", "cat-file", "-e", old], stderr=subprocess.DEVNULL,
        ).returncode == 0:
            bases.add(b"^" + old)
    if tips:
        revisions = b"\n".join(sorted(tips | bases)) + b"\n"
        objects.update(git("rev-list", "--objects", "--no-object-names", "--stdin",
                           data=revisions).splitlines())


def archive_extension(data):
    # Gitleaks selects archive readers by extension. Git blobs have no filename.
    formats = (
        (b"PK\x03\x04", ".zip"), (b"\x1f\x8b", ".gz"), (b"BZh", ".bz2"),
        (b"\xfd7zXZ\x00", ".xz"), (b"7z\xbc\xaf\x27\x1c", ".7z"),
        (b"Rar!\x1a\x07", ".rar"), (b"\x28\xb5\x2f\xfd", ".zst"),
    )
    for signature, extension in formats:
        if data.startswith(signature):
            return extension
    return ".tar" if data[257:262] == b"ustar" else ""


def write_objects(objects, metadata, folder):
    # Send batch queries from a file: neither Git nor its caller can fill a pipe
    # while waiting for the other side to read a large collection of objects.
    queries = folder.parent / "objects"
    queries.write_bytes(b"\n".join(objects) + (b"\n" if objects else b""))
    with queries.open("rb") as source, subprocess.Popen(
        ["git", "cat-file", "--batch"], stdin=source, stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
    ) as proc:
        for expected in objects:
            oid, kind, size = proc.stdout.readline().split()
            if oid != expected:
                raise ValueError("unexpected object")
            data = proc.stdout.read(int(size))
            if len(data) != int(size) or proc.stdout.read(1) != b"\n":
                raise ValueError("truncated object")
            if kind == b"tree":
                # Tree entries contain a mode, a filename, NUL, and a raw object ID.
                offset = 0
                while offset < len(data):
                    end = data.index(b"\0", offset)
                    name = data[offset:end].split(b" ", 1)[1]
                    check_name(name)
                    metadata.append(name)
                    offset = end + 1 + len(oid) // 2
            elif kind in (b"commit", b"tag"):
                header, _, message = data.partition(b"\n\n")
                if kind == b"tag":
                    metadata.extend(line[4:] for line in header.splitlines() if line.startswith(b"tag "))
                (folder / oid.decode()).write_bytes(message)
            elif kind == b"blob":
                (folder / (oid.decode() + archive_extension(data))).write_bytes(data)
        if proc.wait():
            raise ValueError("git cat-file failed")
