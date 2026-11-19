#!/usr/bin/env python3
"""Create missing _variants/w640 and w960 copies for R2 listing photos.

Reads R2 credentials from D:\\master-credentials.json (cloudflare_r2). Same resize
settings as upload-curated-r2-images.py. Only writes keys that do not exist yet;
originals are never modified. DRY_RUN=1 lists what it would do.
"""
import io
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

import boto3
from botocore.config import Config
from PIL import Image, ImageOps

WIDTHS = (640, 960)
QUALITY = 78
DRY_RUN = os.environ.get("DRY_RUN") == "1"

c = json.load(open(r"D:\master-credentials.json"))["cloudflare_r2"]
BUCKET = c["bucket"]
s3 = boto3.client("s3", endpoint_url=c["s3_endpoint"], aws_access_key_id=c["s3_access_key_id"],
                  aws_secret_access_key=c["s3_secret_access_key"], region_name="auto",
                  config=Config(signature_version="s3v4"))

keys = set()
for page in s3.get_paginator("list_objects_v2").paginate(Bucket=BUCKET):
    keys.update(o["Key"] for o in page.get("Contents", []))

originals = [k for k in keys if not k.startswith("_variants/") and k.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))]
todo = [(k, w) for k in originals for w in WIDTHS if f"_variants/w{w}/{k}" not in keys]
print(f"{len(originals)} originals, {len(todo)} variants to create", flush=True)

if DRY_RUN:
    sys.exit(0)


def process(key):
    raw = s3.get_object(Bucket=BUCKET, Key=key)["Body"].read()
    for w in (w for k, w in todo if k == key):
        with Image.open(io.BytesIO(raw)) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((w, w), Image.Resampling.LANCZOS)
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            out = io.BytesIO()
            img.save(out, format="JPEG", quality=QUALITY, optimize=True, progressive=True)
        s3.put_object(Bucket=BUCKET, Key=f"_variants/w{w}/{key}", Body=out.getvalue(),
                      ContentType="image/jpeg", CacheControl="public, max-age=31536000, immutable")


done = failed = 0
pending = sorted({k for k, _ in todo})
with ThreadPoolExecutor(max_workers=8) as pool:
    futures = {pool.submit(process, k): k for k in pending}
    for f in as_completed(futures):
        try:
            f.result()
            done += 1
        except Exception as e:
            failed += 1
            print(f"FAILED {futures[f]}: {e}", flush=True)
        if (done + failed) % 25 == 0:
            print(f"progress {done + failed}/{len(pending)}", flush=True)

print(f"done: {done} photos, {failed} failed", flush=True)
sys.exit(1 if failed else 0)
