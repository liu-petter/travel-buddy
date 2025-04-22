from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Set up the browser
driver = webdriver.Chrome()  

try:
    
    driver.get("http://localhost:3000/swipe")

    time.sleep(2) 

    # Check the heading exists
    heading = driver.find_element(By.TAG_NAME, "h2")
    assert "Swipe to Select Places You Like" in heading.text

    # Wait and try to find a Tinder card
    cards = driver.find_elements(By.CLASS_NAME, "card")
    assert len(cards) > 0
    print("Cards loaded")

  
finally:
    time.sleep(3)
    driver.quit()
