# conftest.py — shared pytest fixtures for Selenium E2E tests
import pytest
import os

def pytest_configure(config):
    """Create required output directories before tests run."""
    for d in [
        "Test Results/Screenshots",
        "Test Results/Logs",
        "Test Results/HTML",
        "Test Results/Excel",
        "Test Results/Summary",
    ]:
        os.makedirs(d, exist_ok=True)

def pytest_html_report_title(report):
    report.title = "Smart Parking — Selenium E2E Test Report"
