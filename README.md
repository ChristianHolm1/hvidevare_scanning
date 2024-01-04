# ApplianceInsight: Web Scraping, ML Label Validation, and Visualization for Energy-Efficient Appliances

## Description

This project, developed as part of the 4th semester of Datamatiker/Computer Science at UCN, aims to extract information using a web scraper and validate the data through machine learning.

### Overview

The project comprises several components:

- **Web Scraping**:
  - Utilizes Scrapy, a Python library, to extract relevant links from sitemaps to household appliances from a predefined list of websites.
  - Employs Playwright to open the links, extract information, and capture screenshots of the relevant content.

- **Machine Learning Validation**:
  - Utilizes FastAPI and a pre-trained object detection model based on YOLO via the Ultralytics framework.
  - Screenshots are processed by the model to determine adherence to EU energy label laws:
    - Identifies if it's a new EU energy label, a pre-2021 label, or no label detected.
  - Information, along with previously collected data, is saved to a MongoDB database.

- **Database**:
  - FastAPI is used to access the MongoDB database with endpoints for data manipulation (POST and DELETE).

- **Frontend**:
  - An Angular-based frontend interacts with the MongoDB API to display products from specified sites.
  - Features a grid-like list of products, statistics, and a pie diagram showcasing the distribution of new, old, and unlabeled products.
  - The website is in Danish to cater to local users.

### Usage

Provide instructions on how to:
- Set up the project environment.
- Install necessary dependencies (python requirement files and npm install).
- Run the different components of the project.


### Screenshots/Demo
The dashboard displays products from specified sites, along with statistics and a pie diagram showcasing the distribution of new, old, and unlabeled products.
![Screenshot 1](https://media.discordapp.net/attachments/652170275546464275/1192153940549181550/image.png?ex=65a80ae0&is=659595e0&hm=34ec310a9abcc9fafee49cfc902b19de3b585434a24ae90eff48b4cb1a65fc86&=&format=webp&quality=lossless&width=1079&height=486)
The website features a grid-like list of products, statistics, and a pie diagram showcasing the distribution of new, old, and unlabeled products.
![Screenshot 2](https://media.discordapp.net/attachments/652170275546464275/1192153952553279529/image.png?ex=65a80ae3&is=659595e3&hm=8ee32da68218493c48d73bf617a87152fa66381b4ac7bd7b71b64710ea42785a&=&format=webp&quality=lossless&width=1079&height=537)
![Screenshot 2](https://media.discordapp.net/attachments/652170275546464275/1192157622783197214/image.png?ex=65a80e4e&is=6595994e&hm=54eeff1870739bf6ae9bf5e29fecbcc7ba4a9bf6b55a89e24ba330f23d7f38b5&=&format=webp&quality=lossless&width=1079&height=530)

### Technologies Used

#### [Scrapy](https://scrapy.org/)
- **Purpose:** Web scraping framework in Python used to extract relevant links to household appliances from a predefined list of websites.
- **Key Features:**
  - Efficiently extracts structured data from websites.
  - Enables the creation of robust web crawlers.

#### [Playwright](https://playwright.dev/)
- **Purpose:** Headless browser automation library used alongside Scrapy to open links, extract information, and capture screenshots of relevant content.
- **Key Features:**
  - Provides cross-browser compatibility for web automation.
  - Allows interaction with web pages programmatically.

#### [FastAPI](https://fastapi.tiangolo.com/)
- **Purpose:** Python-based web framework utilized to create APIs for interacting with the machine learning validation process and the MongoDB database.
- **Key Features:**
  - High performance and asynchronous support.
  - Simplified and easy-to-use API development.

#### [Ultralytics (YOLO model)](https://ultralytics.com/)
- **Purpose:** Pre-trained object detection model based on the YOLO (You Only Look Once) architecture employed to validate screenshots.
- **Key Features:**
  - Efficient real-time object detection.
  - Flexibility and accuracy in identifying objects within images.
  - Little code required to implement (only 1 lines of code).
#### [MongoDB](https://www.mongodb.com/)
- **Purpose:** NoSQL database used to store extracted data, including information from appliances and their respective energy labels.
- **Key Features:**
  - Document-oriented database for flexibility in storing unstructured data.
  - Scalability and ease of integration with Python.

#### [Angular](https://angular.io/)
- **Purpose:** Frontend framework used to build the user interface that interacts with the MongoDB API to display product information.
- **Key Features:**
  - Component-based architecture for building dynamic web applications.
  - Two-way data binding and dependency injection for efficient development.

### Contributors
The project was developed by a group of 4 students:
- [Christian](https://github.com/ChristianHolm1)
- [Oliver](https://github.com/OHMelin)
- [Mads](https://github.com/MadsVintherM)
- [Lucas](https://github.com/LRHarboe)
### Additional Notes

The project is not complete, and there are several areas that could be improved upon:
 - The web scraper could be improved to extract more information from the websites.
 - The machine learning validation could be improved to identify more information from the screenshots, and expanded to the full energy labels.
  - The frontend could be improved to display more information
  from the database.
