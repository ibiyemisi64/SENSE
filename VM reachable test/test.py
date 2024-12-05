import requests


def check_ip_status(ip_address):
    try:
        response = requests.get(f"{ip_address}")
        if response.status_code == 200:
            return "IP address is reachable and returned 200 OK"
        else:
            return f"IP address is reachable but didn't return 200 OK (status code: {response.status_code})"
    except requests.exceptions.RequestException as e:
        return f"IP address is not reachable (error: {e})"


# Change to test
ip_address = "http://128.148.36.26:5173/profile"  # change
status = check_ip_status(ip_address)
print(status)