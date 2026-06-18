"""
Selenium Page Object Model — Smart Parking & Reservation System
"""

import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = os.getenv("BASE_URL", "https://Viru-6281.github.io/spic-pdd/")
TIMEOUT = 15


class BasePage:
    """Base class for all Page Objects."""

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, TIMEOUT)

    def go_to(self, path: str = ""):
        self.driver.get(BASE_URL + path)
        time.sleep(2)

    def take_screenshot(self, name: str):
        os.makedirs("Test Results/Screenshots", exist_ok=True)
        path = f"Test Results/Screenshots/{name}_{int(time.time())}.png"
        self.driver.save_screenshot(path)
        return path

    def get_element(self, by, value, timeout: int = TIMEOUT):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )

    def click_element(self, by, value):
        element = WebDriverWait(self.driver, TIMEOUT).until(
            EC.element_to_be_clickable((by, value))
        )
        element.click()

    def type_text(self, by, value, text: str):
        element = self.get_element(by, value)
        element.clear()
        element.send_keys(text)


class HomeAnimationPage(BasePage):
    """Page Object for the landing animation page (/)."""

    def open(self):
        self.go_to("#/")
        return self

    def is_loaded(self) -> bool:
        body = self.driver.find_element(By.TAG_NAME, "body")
        return body is not None

    def navigate_to_lender_login(self):
        self.go_to("#/lenderLogin")


class UserLoginPage(BasePage):
    """Page Object for /userLogin."""

    # Element locators
    EMAIL_FIELD = (By.CSS_SELECTOR, "input[type='email'], input[id='email'], input[placeholder*='email' i]")
    PASSWORD_FIELD = (By.CSS_SELECTOR, "input[type='password'], input[id='password']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button[id='login-button'], button[type='submit']")

    def open(self):
        self.go_to("#/userLogin")
        return self

    def enter_email(self, email: str):
        fields = self.driver.find_elements(*self.EMAIL_FIELD)
        if fields:
            fields[0].clear()
            fields[0].send_keys(email)

    def enter_password(self, password: str):
        fields = self.driver.find_elements(*self.PASSWORD_FIELD)
        if fields:
            fields[0].clear()
            fields[0].send_keys(password)

    def click_login(self):
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        for btn in buttons:
            if any(text in btn.text.lower() for text in ["login", "sign in", "submit"]):
                try:
                    btn.click()
                    time.sleep(2)
                    return
                except Exception:
                    pass

    def login_with(self, email: str, password: str):
        self.enter_email(email)
        self.enter_password(password)
        self.click_login()

    def get_current_url(self) -> str:
        return self.driver.current_url

    def is_on_dashboard(self) -> bool:
        return "userHome" in self.driver.current_url


class LenderLoginPage(BasePage):
    """Page Object for /lenderLogin."""

    def open(self):
        self.go_to("#/lenderLogin")
        return self

    def login_with(self, email: str, password: str):
        fields = self.driver.find_elements(By.CSS_SELECTOR, "input[type='email'], input[type='text']")
        pass_fields = self.driver.find_elements(By.CSS_SELECTOR, "input[type='password']")

        if fields:
            fields[0].clear()
            fields[0].send_keys(email)
        if pass_fields:
            pass_fields[0].clear()
            pass_fields[0].send_keys(password)

        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        for btn in buttons:
            if "login" in btn.text.lower() or "sign" in btn.text.lower():
                try:
                    btn.click()
                    time.sleep(2)
                    break
                except Exception:
                    pass

    def is_on_dashboard(self) -> bool:
        return "lenderHome" in self.driver.current_url


class UserRegistrationPage(BasePage):
    """Page Object for /userRegister."""

    def open(self):
        self.go_to("#/userRegister")
        return self

    def fill_registration_form(self, name: str, email: str, password: str, mobile: str = "", address: str = ""):
        inputs = self.driver.find_elements(By.TAG_NAME, "input")
        for inp in inputs:
            placeholder = inp.get_attribute("placeholder") or ""
            input_type = inp.get_attribute("type") or "text"
            input_id = inp.get_attribute("id") or ""

            if "name" in placeholder.lower() or "name" in input_id.lower():
                inp.clear()
                inp.send_keys(name)
            elif "email" in placeholder.lower() or input_type == "email" or "email" in input_id.lower():
                inp.clear()
                inp.send_keys(email)
            elif input_type == "password":
                inp.clear()
                inp.send_keys(password)
            elif "mobile" in placeholder.lower() or "phone" in placeholder.lower():
                inp.clear()
                inp.send_keys(mobile)
            elif "address" in placeholder.lower():
                inp.clear()
                inp.send_keys(address)

    def submit(self):
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        for btn in buttons:
            if any(t in btn.text.lower() for t in ["register", "sign up", "create", "submit"]):
                try:
                    btn.click()
                    time.sleep(2)
                    return
                except Exception:
                    pass
