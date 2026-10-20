#!/usr/bin/env python3
"""
PuranBazar Deployment & Source Code Bundler
Creates production-ready ZIP archives of both source code and production build.
"""
import os
import zipfile
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOWNLOADS_DIR = os.path.join(ROOT_DIR, "public", "downloads")
DIST_DIR = os.path.join(ROOT_DIR, "dist")

os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# 1. Clean dist/downloads if Vite copied it, so dist remains purely website files
dist_downloads = os.path.join(DIST_DIR, "downloads")
if os.path.exists(dist_downloads):
    shutil.rmtree(dist_downloads, ignore_errors=True)

# 2. Create Source Code ZIP Bundle
SOURCE_ZIP_PUBLIC = os.path.join(DOWNLOADS_DIR, "puranbazar-source-code.zip")
SOURCE_ZIP_ROOT = os.path.join(ROOT_DIR, "puranbazar-source-code.zip")

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    "dist",
    ".cache",
    ".local",
    "__pycache__",
}

EXCLUDE_FILES = {
    "puranbazar-source-code.zip",
    "puranbazar-production-dist.zip",
}

print("==> Creating Complete Source Code Bundle...")
with zipfile.ZipFile(SOURCE_ZIP_PUBLIC, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(ROOT_DIR):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
        
        # Don't recurse into public/downloads while building zip
        if "public" in root and "downloads" in root:
            continue

        for file in files:
            if file in EXCLUDE_FILES or file.endswith(".zip") or file.endswith(".tar.gz"):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, ROOT_DIR)
            zipf.write(full_path, arcname=rel_path)

shutil.copy2(SOURCE_ZIP_PUBLIC, SOURCE_ZIP_ROOT)
print(f"✓ Source Code ZIP created successfully: {os.path.getsize(SOURCE_ZIP_ROOT) / 1024:.1f} KB")

# 3. Create Android Studio Native App Bundle
ANDROID_DIR = os.path.join(ROOT_DIR, "android")
if os.path.exists(ANDROID_DIR):
    ANDROID_ZIP_PUBLIC = os.path.join(DOWNLOADS_DIR, "puranbazar-android-project.zip")
    ANDROID_ZIP_ROOT = os.path.join(ROOT_DIR, "puranbazar-android-project.zip")

    print("==> Creating Android Studio Native Project Bundle...")
    with zipfile.ZipFile(ANDROID_ZIP_PUBLIC, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(ANDROID_DIR):
            dirs[:] = [d for d in dirs if d not in {".gradle", "build", ".idea"}]
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ANDROID_DIR)
                zipf.write(full_path, arcname=os.path.join("PuranBazar-Android-App", rel_path))
        # Also include the guide in the zip
        guide_path = os.path.join(ROOT_DIR, "PLAY_STORE_UPLOAD_GUIDE_BN.md")
        if os.path.exists(guide_path):
            zipf.write(guide_path, arcname="PuranBazar-Android-App/PLAY_STORE_UPLOAD_GUIDE_BN.md")

    shutil.copy2(ANDROID_ZIP_PUBLIC, ANDROID_ZIP_ROOT)
    print(f"✓ Android Studio Project ZIP created successfully: {os.path.getsize(ANDROID_ZIP_ROOT) / 1024:.1f} KB")

# 4. Create Production Dist ZIP Bundle
if os.path.exists(DIST_DIR):
    DIST_ZIP_PUBLIC = os.path.join(DOWNLOADS_DIR, "puranbazar-production-dist.zip")
    DIST_ZIP_ROOT = os.path.join(ROOT_DIR, "puranbazar-production-dist.zip")

    print("==> Creating Production Dist Bundle for cPanel / Web Hosting...")
    with zipfile.ZipFile(DIST_ZIP_PUBLIC, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            if "downloads" in root:
                continue
            for file in files:
                if file.endswith(".zip"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, DIST_DIR)
                zipf.write(full_path, arcname=rel_path)

    shutil.copy2(DIST_ZIP_PUBLIC, DIST_ZIP_ROOT)
    print(f"✓ Production Dist ZIP created successfully: {os.path.getsize(DIST_ZIP_ROOT) / 1024:.1f} KB")

print("\nAll bundles ready!")
