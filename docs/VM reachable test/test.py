import requests
import logging
import http.client

def check_ip_status(ip_address):
    http.client.HTTPConnection.debuglevel = 1
    logging.basicConfig(level=logging.DEBUG)
    try:
        response = requests.get(f"{ip_address}")
        if response.status_code == 200:
            return "IP address is reachable and returned 200 OK"
        else:
            return f"IP address is reachable but didn't return 200 OK (status code: {response.status_code})"
    except requests.exceptions.RequestException as e:
        return f"IP address is not reachable (error: {e})"


# Change to test
ip_address = "http://127.0.0.1:9101?uri=http://127.0.0.1:33879/tSKGdVdGwKQ=/"  # change
status = check_ip_status(ip_address)
print(status)