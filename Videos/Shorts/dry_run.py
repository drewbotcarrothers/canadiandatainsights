import os
import shutil
import subprocess
import time
import requests
from pathlib import Path

# Import local modules
import data_manager
import slide_generator
import video_assembler

SHORTS_DIR = Path(__file__).parent
DRY_RUN_DIR = SHORTS_DIR / "dry_run_output"
ROOT_DIR = SHORTS_DIR.parent.parent

def start_dev_server():
    """Starts the Next.js dev server in the background and waits for it to be ready."""
    print("🚀 Starting Next.js dev server (this might take a moment)...")
    process = subprocess.Popen(["npm", "run", "dev"], cwd=str(ROOT_DIR), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Wait for the server to respond
    max_retries = 45
    for i in range(max_retries):
        try:
            response = requests.get("http://localhost:3000", timeout=2)
            if response.status_code == 200:
                print("✅ Dev server is ready.")
                return process
        except requests.exceptions.RequestException:
            pass
        time.sleep(2)
        if i % 5 == 0:
            print(f"Waiting for server... ({i+1}/{max_retries})")
    
    print("❌ Dev server failed to start.")
    return process

def stop_dev_server(process):
    if process:
        print("🛑 Stopping dev server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()

def dry_run():
    print("🎬 Starting ENHANCED DRY RUN (White Theme + UI Components)...")
    
    dev_process = None
    try:
        # 1. Get next location
        loc = data_manager.get_next_location()
        if not loc:
            print("No locations found.")
            return

        loc_name = loc["GEO_NAME"]
        print(f"📍 Location: {loc_name}")

        # 2. Cleanup & Create folder
        if DRY_RUN_DIR.exists():
            shutil.rmtree(DRY_RUN_DIR)
        os.makedirs(DRY_RUN_DIR)
        
        # 3. Start Dev Server
        dev_process = start_dev_server()
        
        # 4. Generate Slides
        print("🖼️  Generating slides (Capturing actual UI cards)...")
        slides_sub_dir = DRY_RUN_DIR / "slides"
        slide_paths = slide_generator.generate_slides(loc, str(slides_sub_dir))
        
        # 5. Assemble Video
        print("🎥 Assembling video...")
        video_output = str(DRY_RUN_DIR / "toronto_enhanced_dry_run.mp4")
        video_assembler.assemble_video(slide_paths, video_output)
        
        print("\n✅ ENHANCED DRY RUN COMPLETE!")
        print(f"📁 New Slides: {slides_sub_dir}")
        print(f"🎬 New Video: {video_output}")
        print("\n(Note: Tracker not updated, No video uploaded)")

    finally:
        if dev_process:
            stop_dev_server(dev_process)

if __name__ == "__main__":
    dry_run()
