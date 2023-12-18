import requests

class DatabaseHandler:
    def __init__(self, website_name, database_url):
        self.website_name = website_name
        self.database_url = database_url
    
    async def delete_data_in_db(self):
        try:
            url = self.database_url + self.website_name
            response = requests.delete(url)
            if response.status_code == 200:
                print(f"Data deletion successful for {url}")
                return True
            else:
                print(f"Failed to delete data for {url}. Status code: {response.status_code}")
                return False
        except requests.RequestException as e:
            print(f"Request error occurred: {e}")
            return False
    
    async def send_data_to_db(self, data):
        try:
            url = self.database_url + self.website_name
            response = requests.post(url, data=data)
            if response.status_code == 201:
                print(f"Data sent successfully to {url}")
                return True
            else:
                print(f"Failed to send data to {url}. Status code: {response.status_code}")
                return False
        except requests.RequestException as e:
            print(f"Request error occurred: {e}")
            return False
        
    async def process_data_to_db(self, data):
        await self.delete_data_in_db()
        await self.send_data_to_db(data)
