from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reports" / "apple-review-qa"
OUT.mkdir(parents=True, exist_ok=True)


def wait_ready(page):
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1800)


def run_flow(browser, name, viewport, is_mobile=False):
    context = browser.new_context(viewport=viewport, is_mobile=is_mobile)
    context.add_init_script("localStorage.setItem('motokah_welcome_completed', 'true')")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
    page.on("console", lambda msg: errors.append(f"console {msg.type}: {msg.text}") if msg.type == "error" else None)

    page.goto("http://127.0.0.1:8080/")
    wait_ready(page)
    page.screenshot(path=str(OUT / f"{name}-home.png"), full_page=True)

    page.goto("http://127.0.0.1:8080/search")
    wait_ready(page)
    listing_links = page.locator('a[href^="/listing/"]')
    if listing_links.count() == 0:
        raise AssertionError(f"{name}: search returned no listing links")
    listing_href = listing_links.first.get_attribute("href")

    page.goto(f"http://127.0.0.1:8080{listing_href}")
    wait_ready(page)
    if page.get_by_role("button", name="Back").count() == 0:
        raise AssertionError(f"{name}: listing detail has no visible Back control")
    if page.get_by_role("button", name="Block seller").count() == 0:
        raise AssertionError(f"{name}: listing detail has no Block seller control")
    page.screenshot(path=str(OUT / f"{name}-listing.png"), full_page=True)

    page.goto("http://127.0.0.1:8080/auth")
    wait_ready(page)
    page.get_by_placeholder("Email").fill("user@motokah.com")
    page.get_by_placeholder("Password").fill("moto2026")
    page.locator('form button[type="submit"]').click()
    page.wait_for_timeout(1800)
    page.goto("http://127.0.0.1:8080/profile")
    wait_ready(page)
    page.get_by_role("button", name="Settings", exact=True).click()
    page.wait_for_timeout(400)
    delete_button = page.get_by_role("button", name="Delete my account")
    if delete_button.count() == 0:
        raise AssertionError(f"{name}: Profile Settings has no account deletion control")
    delete_button.scroll_into_view_if_needed()
    page.screenshot(path=str(OUT / f"{name}-delete-account.png"), full_page=True)
    delete_button.click()
    page.get_by_text("Delete your Motokah account?").wait_for()
    page.screenshot(path=str(OUT / f"{name}-delete-confirmation.png"))

    context.close()
    return errors


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    results = {
        "desktop": run_flow(browser, "desktop", {"width": 1440, "height": 1000}),
        "iphone": run_flow(browser, "iphone", {"width": 390, "height": 844}, True),
    }
    browser.close()

for target, target_errors in results.items():
    print(f"{target}: PASS")
    if target_errors:
        print(f"{target} browser errors:")
        for item in target_errors:
            print(f"  {item}")
