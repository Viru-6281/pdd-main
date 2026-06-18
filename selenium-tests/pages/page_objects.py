"""
page_objects.py — Page Object Model for Smart Parking & Reservation System
All page objects use BASE_URL from environment — never hardcoded localhost.
"""

import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

BASE_URL = os.getenv("BASE_URL", "https://viru-6281.github.io/pdd-main/").rstrip("/")
TIMEOUT  = 20


class BasePage:
    """Common browser actions shared by all page objects."""

    def __init__(self, driver):
        self.driver = driver
        self.wait   = WebDriverWait(driver, TIMEOUT)

    def navigate_to(self, hash_path: str = ""):
        url = f"{BASE_URL}/#{hash_path}" if hash_path else BASE_URL
        self.driver.get(url)
        time.sleep(2)
        return self

    def get_title(self):
        return self.driver.title

    def get_url(self):
        return self.driver.current_url

    def get_body_text(self):
        return self.driver.find_element(By.TAG_NAME, "body").text

    def screenshot(self, name: str):
        import pathlib
        d = pathlib.Path("Test Results/Screenshots")
        d.mkdir(parents=True, exist_ok=True)
        self.driver.save_screenshot(str(d / f"{name}.png"))

    def find(self, by, value, timeout=TIMEOUT):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )

    def find_all(self, by, value):
        return self.driver.find_elements(by, value)

    def click(self, by, value):
        el = self.wait.until(EC.element_to_be_clickable((by, value)))
        el.click()
        time.sleep(1)
        return el

    def type_into(self, by, value, text: str):
        el = self.find(by, value)
        el.clear()
        el.send_keys(text)
        return el

    def is_on_page(self, hash_fragment: str) -> bool:
        return hash_fragment in self.driver.current_url

    def no_alert_present(self):
        try:
            a = self.driver.switch_to.alert
            txt = a.text
            a.accept()
            return False, txt
        except Exception:
            return True, None


# ─────────────────────────────────────────────────────────────────────
class LandingPage(BasePage):
    """/ — Car animation splash screen."""

    PATH = ""

    def open(self):
        return self.navigate_to(self.PATH)

    def is_loaded(self) -> bool:
        body = self.get_body_text()
        return "Cannot GET" not in body and "404" not in self.get_title()


# ─────────────────────────────────────────────────────────────────────
class UserLoginPage(BasePage):
    """/userLogin"""

    PATH = "/userLogin"

    # Locators — flexible to accommodate any CSS framework
    EMAIL_SELECTORS = [
        (By.CSS_SELECTOR, "input[type='email']"),
        (By.CSS_SELECTOR, "input[id*='email' i]"),
        (By.CSS_SELECTOR, "input[placeholder*='email' i]"),
        (By.CSS_SELECTOR, "input[name*='email' i]"),
    ]
    PASSWORD_SELECTORS = [
        (By.CSS_SELECTOR, "input[type='password']"),
        (By.CSS_SELECTOR, "input[id*='password' i]"),
        (By.CSS_SELECTOR, "input[placeholder*='password' i]"),
    ]
    BUTTON_SELECTORS = [
        (By.CSS_SELECTOR, "button[type='submit']"),
        (By.XPATH, "//button[contains(translate(text(),'LOGIN','login'),'login')]"),
        (By.TAG_NAME, "button"),
    ]

    def open(self):
        return self.navigate_to(self.PATH)

    def _find_first(self, selector_list):
        for by, val in selector_list:
            els = self.driver.find_elements(by, val)
            if els:
                return els[0]
        return None

    def enter_email(self, email: str):
        el = self._find_first(self.EMAIL_SELECTORS)
        if el:
            el.clear()
            el.send_keys(email)
        return self

    def enter_password(self, password: str):
        el = self._find_first(self.PASSWORD_SELECTORS)
        if el:
            el.clear()
            el.send_keys(password)
        return self

    def click_login(self):
        el = self._find_first(self.BUTTON_SELECTORS)
        if el:
            try:
                el.click()
                time.sleep(3)
            except Exception:
                pass
        return self

    def login(self, email: str, password: str):
        return self.enter_email(email).enter_password(password).click_login()

    def is_authenticated(self) -> bool:
        return "userHome" in self.get_url()

    def has_email_field(self) -> bool:
        return self._find_first(self.EMAIL_SELECTORS) is not None

    def has_password_field(self) -> bool:
        return self._find_first(self.PASSWORD_SELECTORS) is not None


# ─────────────────────────────────────────────────────────────────────
class LenderLoginPage(BasePage):
    """/lenderLogin"""

    PATH = "/lenderLogin"

    def open(self):
        return self.navigate_to(self.PATH)

    def _find_email(self):
        for sel in [
            "input[type='email']", "input[id*='email' i]",
            "input[placeholder*='email' i]"
        ]:
            els = self.driver.find_elements(By.CSS_SELECTOR, sel)
            if els:
                return els[0]
        return None

    def _find_password(self):
        els = self.driver.find_elements(By.CSS_SELECTOR, "input[type='password']")
        return els[0] if els else None

    def _find_button(self):
        for btn in self.driver.find_elements(By.TAG_NAME, "button"):
            if "login" in btn.text.lower() or "sign in" in btn.text.lower():
                return btn
        btns = self.driver.find_elements(By.TAG_NAME, "button")
        return btns[0] if btns else None

    def login(self, email: str, password: str):
        ef = self._find_email()
        pf = self._find_password()
        if ef:
            ef.clear(); ef.send_keys(email)
        if pf:
            pf.clear(); pf.send_keys(password)
        btn = self._find_button()
        if btn:
            try:
                btn.click(); time.sleep(3)
            except Exception:
                pass
        return self

    def is_authenticated(self) -> bool:
        return "lenderHome" in self.get_url()


# ─────────────────────────────────────────────────────────────────────
class UserRegistrationPage(BasePage):
    """/userRegister"""

    PATH = "/userRegister"

    def open(self):
        return self.navigate_to(self.PATH)

    def get_all_inputs(self):
        return self.driver.find_elements(By.TAG_NAME, "input")

    def fill_xss_in_all_fields(self, payload: str):
        for inp in self.get_all_inputs():
            try:
                t = inp.get_attribute("type") or ""
                if t not in ("submit", "button", "checkbox", "radio", "hidden"):
                    inp.clear()
                    inp.send_keys(payload)
            except Exception:
                pass
        return self

    def has_inputs(self) -> bool:
        return len(self.get_all_inputs()) > 0


# ─────────────────────────────────────────────────────────────────────
class LenderRegistrationPage(BasePage):
    """/lenderRegister"""

    PATH = "/lenderRegister"

    def open(self):
        return self.navigate_to(self.PATH)

    def has_inputs(self) -> bool:
        return len(self.driver.find_elements(By.TAG_NAME, "input")) > 0


# ─────────────────────────────────────────────────────────────────────
class UserHomePage(BasePage):
    """/userHome — protected page."""

    PATH = "/userHome"

    def open(self):
        return self.navigate_to(self.PATH)

    def is_dashboard_visible(self) -> bool:
        return "userHome" in self.get_url()


# ─────────────────────────────────────────────────────────────────────
class BookParkingPage(BasePage):
    """/book-parking/:lenderId"""

    def open(self, lender_id: int = 1):
        return self.navigate_to(f"/book-parking/{lender_id}")


# ─────────────────────────────────────────────────────────────────────
class ViewMapPage(BasePage):
    """/user/view-map"""

    def open(self):
        return self.navigate_to("/user/view-map")


# ─────────────────────────────────────────────────────────────────────
class RatingsPage(BasePage):
    """/user/give-rating"""

    def open(self):
        return self.navigate_to("/user/give-rating")


# ─────────────────────────────────────────────────────────────────────
class AddVehiclePage(BasePage):
    """/user/add-vehicle"""

    def open(self):
        return self.navigate_to("/user/add-vehicle")
