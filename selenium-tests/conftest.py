"""
conftest.py — pytest configuration for Selenium E2E suite.
Shared fixtures and hooks for all test modules.
"""

import os
import time
import pytest
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# ── Config ──────────────────────────────────────────────────────────
BASE_URL       = os.getenv("BASE_URL", "https://viru-6281.github.io/pdd-main/").rstrip("/")
SCREENSHOT_DIR = Path("Test Results") / "Screenshots"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


# ── Chrome driver factory ────────────────────────────────────────────
def make_driver(window_size=(1920, 1080)):
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument(f"--window-size={window_size[0]},{window_size[1]}")
    opts.add_argument("--disable-extensions")
    opts.add_argument("--disable-popup-blocking")
    opts.add_argument("--ignore-certificate-errors")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])

    try:
        from webdriver_manager.chrome import ChromeDriverManager
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=opts)
    except Exception:
        driver = webdriver.Chrome(options=opts)

    driver.implicitly_wait(10)
    driver.set_page_load_timeout(30)
    return driver


# ── Session-scoped driver (reused across tests for speed) ────────────
@pytest.fixture(scope="session")
def session_driver():
    driver = make_driver()
    yield driver
    driver.quit()


# ── Function-scoped driver (clean state per test) ────────────────────
@pytest.fixture(scope="function")
def driver():
    d = make_driver()
    yield d
    d.quit()


# ── Auto-screenshot on failure ────────────────────────────────────────
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report  = outcome.get_result()

    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver") or item.funcargs.get("session_driver")
        if driver:
            name = item.name.replace("/", "_").replace(" ", "_")[:60]
            path = SCREENSHOT_DIR / f"FAIL_{name}.png"
            try:
                driver.save_screenshot(str(path))
                print(f"\n  📸 Failure screenshot: {path}")
            except Exception:
                pass


# ── Pytest metadata ──────────────────────────────────────────────────



def pytest_html_report_title(report):
    report.title = "Smart Parking — Selenium E2E Test Report"


def pytest_configure(config):
    # Custom markers
    config.addinivalue_line("markers", "security: mark test as a security/DAST test")
    config.addinivalue_line("markers", "smoke: mark test as part of the smoke test suite")
    config.addinivalue_line("markers", "regression: mark test as a regression test")
    # Inject metadata into HTML report (pytest-html 4.x compatible)
    if hasattr(config, '_metadata'):
        config._metadata['Base URL'] = BASE_URL
        config._metadata['Browser'] = 'Google Chrome (Headless)'
        config._metadata['Framework'] = 'Selenium 4.21.0'
        config._metadata['Environment'] = 'GitHub Pages (Production)'
