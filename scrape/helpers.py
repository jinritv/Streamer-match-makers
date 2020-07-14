import time
from bs4 import BeautifulSoup


def parse_time(raw_time):
    """Parses raw time into minutes (int)
    i.e. "6 hours, 27 mins" -> 387

    @param raw_time:
    @return:
    """
    hours = int(raw_time.split(" ")[0])
    try:
        mins = int(raw_time.split(" ")[2])
    except IndexError:
        mins = 0
    return (hours * 60) + mins


def parser_url(driver, url, wait=1):
    driver.get(url)
    time.sleep(wait)
    return BeautifulSoup(driver.page_source, "html.parser")