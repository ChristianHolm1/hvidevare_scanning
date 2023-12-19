import requests

class DatabaseHandler:
    """
    Handles sending data to the database.
    """
    def __init__(self, website_name : str, database_url: str):
        """
        Initialize the DatabaseHandler class.
        
        Args:
            website_name (str): The name of the website.
            database_url (str): The URL to the database.
        """
        self.website_name = website_name
        self.database_url = database_url
    
    async def process_data_to_db(self, data : dict):
        """
        Process data to the database.
        
        Args:
            data (dict): The data to send to the database.
        Returns:
            bool: True if data was sent successfully, False otherwise.
        """
        delete_response = await self.delete_data_in_db()
        insert_response = await self.send_data_to_db(data)
        return delete_response and insert_response
    
    async def send_data_to_db(self, data : dict):
        """
        Send data to the database.
        
        Args:
            data (dict): The data to send to the database.
        Returns:
            bool: True if data was deleted successfully, False otherwise.
        Exeptions:
            requests.RequestException: If an error occurs while sending the request.
        """
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
    
    async def delete_data_in_db(self):
        """
        Delete data in the database.
        
        Returns:
            bool: True if data was deleted successfully, False otherwise.
        Exeptions:
            requests.RequestException: If an error occurs while sending the request.
        """
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
   
