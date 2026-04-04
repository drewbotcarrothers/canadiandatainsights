import os
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

SHORTS_DIR = Path(__file__).parent
FONTS_DIR = SHORTS_DIR
MAPS_DIR = SHORTS_DIR.parent.parent / "Map_Images"

# Use downloaded Roboto Bold
FONT_PATH = FONTS_DIR / "Roboto-Bold.ttf"

# Video dimensions (YouTube Shorts)
WIDTH, HEIGHT = 1080, 1920

def slugify(text):
    """Converts a string to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def create_white_bg():
    return Image.new("RGB", (WIDTH, HEIGHT), "white")

def draw_text_with_stroke(draw, x, y, text, font, fill_color, stroke_color, stroke_width, align="center"):
    """Draw text with a black stroke (outline)."""
    for offsets in [(-1, -1), (1, -1), (-1, 1), (1, 1), (0, -1), (0, 1), (-1, 0), (1, 0)]:
        for i in range(1, stroke_width + 1):
            ox, oy = offsets[0] * i, offsets[1] * i
            draw.text((x + ox, y + oy), text, font=font, fill=stroke_color, anchor="mm", align=align)
    draw.text((x, y), text, font=font, fill=fill_color, anchor="mm", align=align)

def capture_charts(slug, output_dir):
    """Uses Playwright to capture screenshots of specific data cards."""
    url = f"http://localhost:3000/location/{slug}"
    print(f"🌐 Capturing charts from {url}...")
    
    # Map of ID to filename
    cards = {
        "pop-card-stats": "chart_pop_stats.png",
        "pop-card-chart": "chart_pop_age.png",
        "hh-card-stats": "chart_hh_stats.png",
        "hh-card-chart": "chart_hh_comp.png",
        "income-card-stats": "chart_income_stats.png",
        "income-card-chart": "chart_income_dist.png",
        "employment-card-stats": "chart_emp_stats.png",
        "low-income-card-stats": "chart_low_income.png",
        "lang-card-stats": "chart_lang_stats.png",
        "lang-card-chart": "chart_lang_top.png"
    }
    
    captured_files = {}
    
    with sync_playwright() as p:
        # Use a mobile-like viewport for better chart scaling
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 600, 'height': 1200},
            device_scale_factor=2 # High DPI for clarity
        )
        page = context.new_page()
        
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            # Wait for charts to animate/settle
            page.wait_for_timeout(2000)
            
            for card_id, filename in cards.items():
                element = page.query_selector(f"#{card_id}")
                if element:
                    path = os.path.join(output_dir, filename)
                    element.screenshot(path=path)
                    captured_files[card_id] = path
                else:
                    print(f"⚠️ Could not find element #{card_id}")
        except Exception as e:
            print(f"❌ Playwright error: {e}")
        finally:
            browser.close()
            
    return captured_files

def generate_slides(location_data, output_dir):
    """Generate all slide images for a given location."""
    os.makedirs(output_dir, exist_ok=True)
    loc_name = str(location_data.get("GEO_NAME", "Location"))
    display_name = loc_name.split(",")[0].strip()
    slug = slugify(display_name)
    
    # 1. Capture Real Charts
    chart_files = capture_charts(slug, output_dir)
    
    # Pre-load fonts
    try:
        title_font = ImageFont.truetype(str(FONT_PATH), 80)
        hook_font = ImageFont.truetype(str(FONT_PATH), 95)
    except IOError:
        print("Font not found! Using default.")
        title_font = ImageFont.load_default()
        hook_font = ImageFont.load_default()

    # Colors
    TEXT_COLOR = "#0F172A" # Dark Slate
    ACCENT_COLOR = "#3B82F6" # Blue

    # --- 1. Map Hook Slide (Keep Map background for the hook) ---
    map_image_path = MAPS_DIR / f"{loc_name.replace(' ', '_')}_Map.jpg"
    if not map_image_path.exists():
        map_image_path = MAPS_DIR / f"{display_name.replace(' ', '_')}_Map.jpg"

    if map_image_path.exists():
        bg = Image.open(map_image_path).convert("RGBA")
        scale = max(WIDTH / bg.width, HEIGHT / bg.height)
        bg = bg.resize((int(bg.width * scale), int(bg.height * scale)), Image.Resampling.LANCZOS)
        left = (bg.width - WIDTH) / 2
        top = (bg.height - HEIGHT) / 2
        bg = bg.crop((left, top, left + WIDTH, top + HEIGHT))
    else:
        bg = Image.new("RGB", (WIDTH, HEIGHT), "#0D1117") # Fallback to dark for map hook

    draw = ImageDraw.Draw(bg)
    hook_text = f"Most people don't know\nthis about\n{display_name}"
    draw_text_with_stroke(draw, WIDTH // 2, HEIGHT // 2, hook_text, hook_font, "white", "black", 4)
    
    slide_paths = []
    hook_path = os.path.join(output_dir, "slide_00_hook.jpg")
    bg.convert("RGB").save(hook_path)
    slide_paths.append(("hook", hook_path))

    # Helper for card slides
    def create_card_slide(idx, title, card_id):
        slide = create_white_bg()
        d = ImageDraw.Draw(slide)
        
        # Draw Title at top (moved down to 350 for more space)
        d.text((WIDTH // 2, 350), title, font=title_font, fill=TEXT_COLOR, anchor="mm")
        
        # Paste Chart
        if card_id in chart_files:
            chart_img = Image.open(chart_files[card_id])
            # Scale chart to fit width (leaving margins)
            max_w = WIDTH - 120
            scale = max_w / chart_img.width
            chart_img = chart_img.resize((int(chart_img.width * scale), int(chart_img.height * scale)), Image.Resampling.LANCZOS)
            
            # Center vertically (shifted down to accommodate lower title)
            y_offset = (HEIGHT - chart_img.height) // 2 + 200
            slide.paste(chart_img, ((WIDTH - chart_img.width) // 2, y_offset))
        
        path = os.path.join(output_dir, f"slide_{idx:02d}.jpg")
        slide.save(path)
        slide_paths.append((title, path))

    # --- 2-10. Data Slides ---
    create_card_slide(1, f"{display_name} Population", "pop-card-stats")
    create_card_slide(2, f"Age Distribution", "pop-card-chart")
    create_card_slide(3, f"Household Size", "hh-card-stats")
    create_card_slide(4, f"Household Composition", "hh-card-chart")
    create_card_slide(5, f"Income Summary", "income-card-stats")
    create_card_slide(6, f"Income Brackets", "income-card-chart")
    create_card_slide(7, f"Employment Stats", "employment-card-stats")
    create_card_slide(8, f"Low Income Prevalence", "low-income-card-stats")
    create_card_slide(9, f"Language Knowledge", "lang-card-stats")
    create_card_slide(10, f"Top Languages", "lang-card-chart")

    # --- 11. End Slide ---
    slide_end = create_white_bg()
    d_end = ImageDraw.Draw(slide_end)
    d_end.text((WIDTH // 2, HEIGHT // 2), "Like, Comment\n& Subscribe!", font=hook_font, fill=ACCENT_COLOR, anchor="mm", align="center")
    path_end = os.path.join(output_dir, "slide_11_end.jpg")
    slide_end.save(path_end)
    slide_paths.append(("end", path_end))

    return slide_paths
