import os
import shutil
import re
import subprocess
import time
import requests
from pathlib import Path
from datetime import datetime

# Import local modules
import data_manager
import slide_generator
import video_assembler
import youtube_uploader

SHORTS_DIR = Path(__file__).parent
TEMP_DIR = SHORTS_DIR / "temp_run"
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
    return process # still return it so it can be terminated if it hung

def stop_dev_server(process):
    if process:
        print("🛑 Stopping dev server...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()

def slugify(text):
    """Converts a string to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def generate_description(location_data, slug):
    """Creates the detailed YouTube video description."""
    loc_name = location_data.get("GEO_NAME", "this location")
    pop = int(location_data.get("POP_2021", 0))
    prov = location_data.get("PROVINCE", "Canada")
    
    url = f"https://canadiandatainsights.com/location/{slug}/"
    
    description = (
        f"📊 Most people don't know this about {loc_name}! \n\n"
        f"In this video, we dive into the latest 2021 Census data for {loc_name}, {prov}. "
        f"With a population of {pop:,}, {loc_name} is one of the most interesting "
        f"places to explore in Canada.\n\n"
        f"🔗 Learn more and see detailed demographic charts for {loc_name} at:\n"
        f"{url}\n\n"
        f"Explore thousands of other locations across Canada on our website: "
        f"https://canadiandatainsights.com/\n\n"
        f"#Canada #Demographics #Data #{prov.replace(' ', '')} #Shorts #CanadianDataInsights"
    )
    return description

def run_pipeline():
    """Executes the full automated pipeline for one location."""
    print(f"\n🎬 Starting Pipeline Run: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    dev_process = None
    try:
        # 1. Get Next Location
        loc = data_manager.get_next_location()
        if not loc:
            print("🛑 No more locations to process. Pipeline stopping.")
            return

        loc_name = loc["GEO_NAME"]
        geo_id = loc["ALT_GEO_CODE"]
        print(f"📍 Selected Location: {loc_name} (GEO ID: {geo_id})")

        # 2. Setup folders
        if TEMP_DIR.exists():
            shutil.rmtree(TEMP_DIR)
        os.makedirs(TEMP_DIR)
        
        # 3. Start Dev Server for screenshotting
        dev_process = start_dev_server()
        
        # 4. Generate Slides
        print("🖼️  Generating slides (Capturing high-fidelity charts)...")
        slide_paths = slide_generator.generate_slides(loc, str(TEMP_DIR / "slides"))
        
        # 5. Assemble Video
        print("🎥 Assembling video...")
        video_output = str(SHORTS_DIR / f"shorts_video_{geo_id}.mp4")
        video_assembler.assemble_video(slide_paths, video_output)
        
        # 6. Prepare Metadata
        slug = slugify(loc_name.split(",")[0].strip())
        title = f"{loc_name.split(',')[0].strip()} - Most People Don’t Know This"
        description = generate_description(loc, slug)
        
        # 7. Upload to YouTube
        print("☁️  Uploading to YouTube...")
        video_id, youtube_url = youtube_uploader.upload_shorts(video_output, title, description)
        
        # 8. Update Tracker
        data_manager.update_tracker(loc_name, loc["GEO_NAME"], geo_id, youtube_url, video_id)
        
        # 9. Cleanup
        print("🧹 Cleaning up...")
        if os.path.exists(video_output):
            os.remove(video_output)
        shutil.rmtree(TEMP_DIR)
        
        print(f"🏁 Pipeline run complete for {loc_name}!")
        
    except Exception as e:
        print(f"❌ Pipeline failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        if dev_process:
            stop_dev_server(dev_process)

if __name__ == "__main__":
    run_pipeline()
