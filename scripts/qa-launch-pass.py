from pathlib import Path
from time import perf_counter
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080"
OUT = Path("reports/launch-pass")
OUT.mkdir(parents=True, exist_ok=True)


def prepare(page):
    page.add_init_script("""
      localStorage.setItem('motokah_welcome_completed', 'true');
      localStorage.setItem('motokah_country', 'Tanzania');
      localStorage.setItem('motokah_city', 'Dar es Salaam');
    """)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    prepare(desktop)
    desktop.on("console", lambda msg: errors.append(f"console:{msg.type}:{msg.text}") if msg.type == "error" else None)
    desktop.on("pageerror", lambda exc: errors.append(f"page:{exc}"))
    desktop.goto(BASE, wait_until="domcontentloaded")
    desktop.wait_for_selector("header", timeout=30000)
    desktop.wait_for_timeout(1500)
    desktop.screenshot(path=str(OUT / "home-desktop.png"), full_page=True)

    initial_url = desktop.url
    currency = desktop.get_by_label("Display currency").first
    started = perf_counter()
    currency.select_option("USD")
    desktop.wait_for_timeout(250)
    currency_ms = round((perf_counter() - started) * 1000)
    assert desktop.url == initial_url, "Currency switch navigated or reloaded the page"

    desktop.get_by_title("Change language").click()
    started = perf_counter()
    desktop.get_by_role("button", name="Kiswahili").click()
    desktop.wait_for_timeout(250)
    language_ms = round((perf_counter() - started) * 1000)
    assert desktop.url == initial_url, "Language switch navigated or reloaded the page"
    assert desktop.get_by_text("Magari ya Kutumika", exact=True).count() > 0

    desktop.goto(f"{BASE}/search?q=no-such-motokah-vehicle&country=All", wait_until="domcontentloaded")
    desktop.wait_for_selector('[aria-label="Search vehicles"]', timeout=30000)
    desktop.wait_for_timeout(5000)
    desktop.screenshot(path=str(OUT / "empty-search-desktop.png"), full_page=True)
    assert desktop.get_by_label("Search vehicles").is_visible()
    assert desktop.get_by_role("heading", name="No vehicles found").is_visible()
    assert desktop.get_by_role("button", name="Go Back").is_visible()

    desktop.goto(f"{BASE}/sell", wait_until="domcontentloaded")
    desktop.wait_for_selector("text=Vehicle video", timeout=30000)
    assert desktop.get_by_text("Vehicle video", exact=True).is_visible()
    assert desktop.locator('input[type="file"][accept*="video/mp4"]').count() == 1

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    prepare(mobile)
    mobile.on("console", lambda msg: errors.append(f"mobile-console:{msg.type}:{msg.text}") if msg.type == "error" else None)
    mobile.on("pageerror", lambda exc: errors.append(f"mobile-page:{exc}"))
    mobile.goto(BASE, wait_until="domcontentloaded")
    mobile.wait_for_selector("header", timeout=30000)
    mobile.wait_for_timeout(1500)
    mobile.screenshot(path=str(OUT / "home-mobile.png"), full_page=True)
    mobile.goto(f"{BASE}/search?country=Tanzania", wait_until="domcontentloaded")
    mobile.wait_for_selector('[aria-label="Search vehicles"]', timeout=30000)
    assert mobile.get_by_label("Search vehicles").is_visible()
    mobile.screenshot(path=str(OUT / "search-mobile.png"), full_page=True)

    print({
        "currency_switch_ms": currency_ms,
        "language_switch_ms": language_ms,
        "console_errors": errors,
        "screenshots": str(OUT.resolve()),
    })
    browser.close()
