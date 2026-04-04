import os
import pickle
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SHORTS_DIR = Path(__file__).parent
CLIENT_SECRETS_FILE = SHORTS_DIR / "client_secrets.json"
TOKEN_PICKLE = SHORTS_DIR / "token.pickle"

# SCOPES for YouTube Data API v3
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

def get_authenticated_service():
    """Authenticates the user and returns the YouTube service object."""
    credentials = None
    
    # Load existing credentials if available
    if TOKEN_PICKLE.exists():
        with open(TOKEN_PICKLE, "rb") as token:
            credentials = pickle.load(token)
            
    # Refresh or fetch new credentials if needed
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS_FILE), SCOPES)
            # This will open a browser for the first run
            credentials = flow.run_local_server(port=0)
            
        # Save credentials for future use
        with open(TOKEN_PICKLE, "wb") as token:
            pickle.dump(credentials, token)
            
    return build("youtube", "v3", credentials=credentials)

def upload_shorts(video_path, title, description, tags=None):
    """Uploads a video to YouTube as a public video."""
    youtube = get_authenticated_service()
    
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags or ["CanadianDataInsights", "Canada", "Demographics", "Shorts"],
            "categoryId": "22" # People & Blogs
        },
        "status": {
            "privacyStatus": "public", # Use 'public' for live deployment
            "selfDeclaredMadeForKids": False
        }
    }
    
    media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True)
    
    print(f"🚀 Uploading video: {title}...")
    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )
    
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploaded {int(status.progress() * 100)}%")
            
    video_id = response.get("id")
    youtube_url = f"https://www.youtube.com/watch?v={video_id}"
    
    print(f"✅ Video uploaded successfully! Video ID: {video_id}")
    return video_id, youtube_url

if __name__ == "__main__":
    # Test (Dry run or real test if video exists)
    # test_video = SHORTS_DIR / "test_output.mp4"
    # if test_video.exists():
    #     upload_shorts(test_video, "Test Title", "Test Description")
    pass
