#!/usr/bin/env python3
r"""
Upload curated Motokah showroom images to Cloudflare R2.

Required env:
  R2_ENDPOINT
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY

Optional env:
  R2_BUCKET=motokah-images
  IMAGE_SOURCE_DIR=D:\cars for motokah
  MAX_IMAGES_PER_POST=8
  JPEG_QUALITY=78
  MAX_EDGE=1400
  VARIANT_WIDTHS=640,960,1400
  DEALERS=comma,separated,usernames
  DRY_RUN=1
  SKIP_EXISTING=1
  FUZZY_SOURCE_DIRS=0
"""

from __future__ import annotations

import io
import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable

import boto3
from botocore.config import Config
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SHOWROOM_DIR = ROOT / "src" / "data" / "showrooms"
SOURCE_DIR = Path(os.environ.get("IMAGE_SOURCE_DIR", r"D:\cars for motokah"))
BUCKET = os.environ.get("R2_BUCKET", "motokah-images")
DRY_RUN = os.environ.get("DRY_RUN", "0") == "1"
SKIP_EXISTING = os.environ.get("SKIP_EXISTING", "1") == "1"
FUZZY_SOURCE_DIRS = os.environ.get("FUZZY_SOURCE_DIRS", "0") == "1"
MAX_IMAGES_PER_POST = int(os.environ.get("MAX_IMAGES_PER_POST", "8"))
JPEG_QUALITY = int(os.environ.get("JPEG_QUALITY", "78"))
MAX_EDGE = int(os.environ.get("MAX_EDGE", "1400"))
VARIANT_WIDTHS = [int(item) for item in os.environ.get("VARIANT_WIDTHS", "640,960,1400").split(",") if item.strip()]

DEFAULT_DEALERS = {
    "al_husnainmotors",
    "khushimotorsdaressalaam",
    "mgayamotors",
    "nairobidrive",
    "gariguruske",
    "rakincars.tz",
    "ethiocarsmarket",
    "used_cars_in_kampala",
    "kk_magic_cars_",
    "hm.autodeals",
    "breemotors",
    "peachcarske",
    "smartautoske",
    "house_of_cars_kenya",
    "aminicar_",
}

DEALER_LISTING_LIMITS = {
    "khushimotorsdaressalaam": 32,
    "al_husnainmotors": 28,
    "mgayamotors": 24,
    "nairobidrive": 24,
    "gariguruske": 24,
    "rakincars.tz": 20,
    "ethiocarsmarket": 18,
    "used_cars_in_kampala": 18,
    "kk_magic_cars_": 18,
    "hm.autodeals": 16,
    "breemotors": 16,
    "peachcarske": 12,
    "smartautoske": 12,
    "house_of_cars_kenya": 12,
    "aminicar_": 10,
}

SKIP_CAPTION_RE = re.compile(
    r"\b("
    r"now available|coming soon|happy birthday|congratulations|sold\b|thank you|"
    r"reel|subscribe|follow|giveaway|parts|spare|tyre|tire|wheel alignment|"
    r"service|maintenance|insurance|financing only"
    r")\b",
    re.I,
)

CAR_HINT_RE = re.compile(
    r"\b("
    r"toyota|nissan|subaru|honda|mazda|bmw|mercedes|benz|audi|volkswagen|vw|"
    r"land rover|range rover|hyundai|kia|isuzu|suzuki|ford|jeep|lexus|porsche|"
    r"harrier|prado|hilux|vitz|crown|rav4|xtrail|x-trail|forester|outback|"
    r"cx-5|cx5|vanguard|spacio|fielder|mark x|noah|alphard|vellfire|"
    r"price|bei|yom|year|mileage|engine|cc"
    r")\b",
    re.I,
)
_SOURCE_INDEX: dict[str, dict[str, Path]] = {}


def selected_dealers() -> set[str]:
    raw = os.environ.get("DEALERS", "").strip()
    if not raw:
        return DEFAULT_DEALERS
    return {item.strip() for item in raw.split(",") if item.strip()}


def image_key(username: str, image: str, shortcode: str, index: int) -> str:
    marker = "/listing-images/"
    if marker in image:
        return image.split(marker, 1)[1].split("?", 1)[0].lstrip("/")
    if image.startswith("http://") or image.startswith("https://"):
        raise ValueError(f"external image cannot be mapped: {image}")
    name = Path(image).name if image else f"{shortcode}_{index + 1}.jpg"
    if not re.search(r"\.(jpe?g|png|webp)$", name, re.I):
        name = f"{shortcode}_{index + 1}.jpg"
    return f"{username}/{name}"


def dealer_source_dirs(username: str) -> list[Path]:
    exact = SOURCE_DIR / username
    candidates = [exact] if exact.exists() else []
    if FUZZY_SOURCE_DIRS and SOURCE_DIR.exists():
        lower = username.lower()
        for path in SOURCE_DIR.iterdir():
            if path.is_dir() and lower in path.name.lower() and path not in candidates:
                candidates.append(path)
    return candidates


def find_local_file(username: str, filename: str) -> Path | None:
    if username not in _SOURCE_INDEX:
        index: dict[str, Path] = {}
        for base in dealer_source_dirs(username):
            for path in base.rglob("*"):
                if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                    index.setdefault(path.name, path)
        _SOURCE_INDEX[username] = index
        print(f"indexed {username} {len(index)} files", flush=True)
    return _SOURCE_INDEX[username].get(filename)


def good_post(caption: str, images: list[str]) -> bool:
    if not images:
        return False
    caption = caption or ""
    if SKIP_CAPTION_RE.search(caption):
        return False
    return bool(CAR_HINT_RE.search(caption))


def iter_referenced_images(dealers: Iterable[str]):
    seen: set[str] = set()
    for username in sorted(dealers):
        json_path = SHOWROOM_DIR / f"{username}.json"
        if not json_path.exists():
            print(f"missing-json {username}", file=sys.stderr)
            continue
        data = json.loads(json_path.read_text(encoding="utf-8"))
        emitted_posts = 0
        for post in data.get("posts", []):
            images = [img for img in post.get("images", []) if img]
            if not good_post(post.get("caption", ""), images):
                continue
            if emitted_posts >= DEALER_LISTING_LIMITS.get(username, 12):
                break
            emitted_posts += 1
            shortcode = post.get("shortcode") or "post"
            for idx, image in enumerate(images[:MAX_IMAGES_PER_POST]):
                try:
                    key = image_key(username, image, shortcode, idx)
                except ValueError:
                    continue
                if key in seen:
                    continue
                seen.add(key)
                yield username, key, Path(key).name


def optimize_image(path: Path, max_edge: int = MAX_EDGE) -> bytes:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        return output.getvalue()


def r2_client():
    endpoint = os.environ.get("R2_ENDPOINT")
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    if not endpoint or not access_key or not secret_key:
        raise SystemExit("Set R2_ENDPOINT, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY first.")
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def object_exists(client, key: str) -> bool:
    try:
        client.head_object(Bucket=BUCKET, Key=key)
        return True
    except Exception:
        return False


def main() -> int:
    dealers = selected_dealers()
    client = None if DRY_RUN else r2_client()
    found = missing = uploaded = failed = total_bytes = 0

    for username, key, filename in iter_referenced_images(dealers):
        source = find_local_file(username, filename)
        if not source:
            missing += 1
            print(f"missing {key}", flush=True)
            continue
        found += 1
        try:
            uploaded_keys = []
            for width in VARIANT_WIDTHS:
                variant_key = key if width == 1400 else f"_variants/w{width}/{key}"
                if not DRY_RUN and SKIP_EXISTING and object_exists(client, variant_key):
                    uploaded_keys.append(f"{variant_key}:exists")
                    continue
                body = optimize_image(source, width)
                total_bytes += len(body)
                if not DRY_RUN:
                    assert client is not None
                    client.put_object(
                        Bucket=BUCKET,
                        Key=variant_key,
                        Body=body,
                        ContentType="image/jpeg",
                        CacheControl="public, max-age=31536000, immutable",
                    )
                uploaded_keys.append(f"{variant_key}:{len(body)}")
            uploaded += 1
            print(f"{'would-upload' if DRY_RUN else 'uploaded'} {key} {' '.join(uploaded_keys)}", flush=True)
        except Exception as exc:
            failed += 1
            print(f"failed {key}: {exc}", file=sys.stderr, flush=True)

    print(
        json.dumps(
            {
                "dealers": sorted(dealers),
                "found": found,
                "missing": missing,
                "uploaded": uploaded,
                "failed": failed,
                "optimized_bytes": total_bytes,
                "optimized_mb": round(total_bytes / 1024 / 1024, 2),
                "dry_run": DRY_RUN,
            },
            indent=2,
        )
    )
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
