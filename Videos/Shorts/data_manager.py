import pandas as pd
from pathlib import Path
from datetime import datetime

SHORTS_DIR = Path(__file__).parent
DATA_DIR = SHORTS_DIR.parent.parent / "Data"
LOCATIONS_CSV = DATA_DIR / "locations.csv"
TRACKER_FILE = SHORTS_DIR / "tracker.xlsx"

TRACKER_COLUMNS = ["Location Name", "GEO Name", "GEO ID", "Date Created", "YouTube URL", "Video ID"]

def get_tracker():
    """Load or create the tracker DataFrame."""
    if TRACKER_FILE.exists():
        return pd.read_excel(TRACKER_FILE)
    else:
        df = pd.DataFrame(columns=TRACKER_COLUMNS)
        df.to_excel(TRACKER_FILE, index=False)
        return df

def update_tracker(location_name, geo_name, geo_id, youtube_url, video_id):
    """Append a new generated video to the tracker."""
    tracker_df = get_tracker()
    
    new_entry = {
        "Location Name": location_name,
        "GEO Name": geo_name,
        "GEO ID": geo_id,
        "Date Created": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "YouTube URL": youtube_url,
        "Video ID": video_id
    }
    
    tracker_df = pd.concat([tracker_df, pd.DataFrame([new_entry])], ignore_index=True)
    tracker_df.to_excel(TRACKER_FILE, index=False)
    print(f"✅ Tracker updated for {location_name}")

def get_next_location():
    """Find the location with the highest POP_2021 that hasn't been generated yet."""
    # 1. Load Locations
    if not LOCATIONS_CSV.exists():
        raise FileNotFoundError(f"Could not find locations data: {LOCATIONS_CSV}")
    
    locations_df = pd.read_csv(LOCATIONS_CSV)
    
    # 2. Filter for individual locations only (Census subdivision)
    # This avoids roll-ups for Country, provinces, etc.
    locations_df = locations_df[locations_df["GEO_LEVEL"] == "Census subdivision"]
    
    # 3. Sort by Population (largest to smallest)
    # Ensure POP_2021 exists and is numeric
    if "POP_2021" in locations_df.columns:
        locations_df["POP_2021"] = pd.to_numeric(locations_df["POP_2021"], errors="coerce")
        locations_df = locations_df.sort_values(by="POP_2021", ascending=False)
    else:
        raise ValueError("POP_2021 column not found in locations.csv")
    
    # 3. Get Tracker and extract completed IDs
    tracker_df = get_tracker()
    completed_ids = set(tracker_df["GEO ID"].astype(str).tolist())
    
    # 4. Find the first location not in completed_ids
    locations_df["ALT_GEO_CODE"] = locations_df["ALT_GEO_CODE"].astype(str)
    
    for _, row in locations_df.iterrows():
        geo_id = row["ALT_GEO_CODE"]
        if geo_id not in completed_ids:
            return row.to_dict()
            
    return None

if __name__ == "__main__":
    next_loc = get_next_location()
    if next_loc:
        print(f"Next Location: {next_loc['GEO_NAME']} (Pop: {next_loc['POP_2021']})")
    else:
        print("All locations have been processed!")
