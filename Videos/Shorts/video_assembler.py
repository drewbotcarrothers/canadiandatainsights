import os
from pathlib import Path
from PIL import Image
# Compatibility fix for moviepy 1.0.3 and Pillow 10+
if not hasattr(Image, 'ANTIALIAS'):
    Image.ANTIALIAS = Image.Resampling.LANCZOS
from moviepy.editor import ImageClip, concatenate_videoclips, AudioFileClip, vfx

SHORTS_DIR = Path(__file__).parent
MUSIC_PATH = SHORTS_DIR / "Futile - The Grey Room _ Golden Palms.mp3"

def apply_zoom(clip, duration, zoom_ratio=0.15):
    """Applies a smooth zoom-in effect to an ImageClip."""
    # This function creates a simple zoom effect by scaling the clip over time
    return clip.resize(lambda t: 1 + zoom_ratio * (t / duration))

def assemble_video(slide_paths, output_path):
    """Assembles slides into a final MP4 video."""
    clips = []
    
    # slide_paths is a list of (title, path)
    for i, (title, path) in enumerate(slide_paths):
        duration = 3.0 # Default duration
        
        if title == "hook":
            duration = 4.0 # Slightly longer for the hook
            clip = ImageClip(path).set_duration(duration)
            # Apply the fast zoom-in effect
            clip = apply_zoom(clip, duration, zoom_ratio=0.3)
        elif title == "end":
            duration = 4.0 # Longer for CTA
            clip = ImageClip(path).set_duration(duration)
        else:
            duration = 3.0
            clip = ImageClip(path).set_duration(duration)
        
        clips.append(clip)

    # Concatenate all clips
    final_video = concatenate_videoclips(clips, method="compose")
    
    # Add Background Music
    if MUSIC_PATH.exists():
        audio = AudioFileClip(str(MUSIC_PATH))
        # Ensure audio is not shorter than video, loop if necessary or just use a segment
        audio = audio.subclip(0, final_video.duration)
        # Fade out audio slightly at the end
        audio = audio.audio_fadeout(2)
        final_video = final_video.set_audio(audio)
    else:
        print(f"Warning: Music not found at {MUSIC_PATH}")

    # Export
    # Use competitive bitrate for high quality on YouTube
    final_video.write_videofile(
        output_path, 
        fps=24, 
        codec="libx264", 
        audio_codec="aac",
        temp_audiofile='temp-audio.m4a', 
        remove_temp=True,
        ffmpeg_params=[
            "-pix_fmt", "yuv420p",
            "-profile:v", "high",
            "-level", "4.1",
            "-movflags", "+faststart",
            "-crf", "23",
            "-preset", "medium"
        ]
    )
    
    return output_path

if __name__ == "__main__":
    # Test logic
    temp_slides_dir = SHORTS_DIR / "temp_slides"
    if temp_slides_dir.exists():
        # Re-construct paths for testing
        test_slide_paths = [
            ("hook", str(temp_slides_dir / "slide_00_hook.jpg")),
            ("Population", str(temp_slides_dir / "slide_01.jpg")),
            ("Households", str(temp_slides_dir / "slide_02.jpg")),
            ("Incomes", str(temp_slides_dir / "slide_03.jpg")),
            ("Employment", str(temp_slides_dir / "slide_04.jpg")),
            ("Languages", str(temp_slides_dir / "slide_05.jpg")),
            ("end", str(temp_slides_dir / "slide_06_end.jpg")),
        ]
        assemble_video(test_slide_paths, str(SHORTS_DIR / "test_output.mp4"))
