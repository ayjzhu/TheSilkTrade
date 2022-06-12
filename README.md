# CS178A-B-Template

## Table of Contents
- [Overview](#overview)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Technology Stack](#Technology-Stack)
- [Specifications](#Specifications)
- [How To Run](#How-To-Run)
- [Known issues](#Known-Issues
- [Diagrams](#diagrams)

## Overview
The Silk Trade is fashion-sharing platform where users can rent clothing from others that share the same fashion style. If the seller listed for sale, the user may also buy a piece of clothing directly without renting the product. In addtion, there is Auth0 intergrated to ensure only authenticated users have access to certain features in the site.

## Usage
The project is being deployed on Heroku:
https://silk-trade.herokuapp.com/

## Technology Stack

### Frontend:
- [React](https://reactjs.org/): React is a component-based modular javascript rendering framework that will allow our site to be lively and responsive to the user.
- [Bootstrap](https://getbootstrap.com/): Bootstrap is a CSS framework directed at responsive front-end web development.

### Backend:
- [MongoDB](https://www.mongodb.com/): MongoDB is a No-SQL document-based storage system. Mongo is a great choice for our need to store unstructured data like text and images for our site.
- [MongoDB](https://nodejs.org/en/)/[Express](https://expressjs.com/): Node offers us an easy way to create a simple backend to deliver our site. Combined with the Express framework for Node, we can easily handle routing, DB connections, API requests, and more.
- [Auth0](https://auth0.com/): Auth0 provides a way to integrate secure user authentication without manually developing and dealing with the intricacies of secure password management.

## Specifications
- User Profiles: Each user will need a profile to be able to make any listings. Users will have the ability to create profiles created through Auth0.
Users will be able to upload photos and descriptions of their clothing for sharing.
- Users can upload photos of their clothes to the “public closet” for sharing. 
- All user information will be stored in a MongoDB database. The database will use clusters to store information. Each user will have a cluster that keeps track of what clothes they are renting and are renting out. 
- Other users will have the ability to ask questions about any listing by leaving comments directly on the listing.
- Each listing will have images of the product, a small description, the price to rent the product, a rating and review of the product, and a price to purchase the product (if applicable).

<Screenshot of application>
  
## How To Run

### Prerequisites
Before runing the app, be sure to duplicate the `.env-example` file in the `backend` directory, rename the duplicate to `.env`, and fill in the values appropriately. This will configure the MongoDB and Auth0 environment. After that is setup, run the command `npm install` (making sure the terminal working directory is in the `backend` directory). 

Repeat the same process above but for the `thesilktrade` directory.

### Development Mode
Have two terminal sessions running:
* In one, go to the `backend` directory (`cd backend`) and execute `node index.js`.
* In the other session, go to the `thesilktrade` directory (`cd thesilktrade`) and execute `npm start`.
You will be able to access the application on `localhost:3000`.

### Production Mode
With one terminal session, go to the `thesilktrade` directory (`cd thesilktrade`) and execute `npm build`.
Then go to the `backend` directory (`cd ../backend`) and execute `node index.js`. You will be able to access the
application on whichever port is specified in the `./backend/.env` file.

## Known Issues
- The active listing page is not fully functional.
- Image for invididual item is yet to implement.

## Diagrams

### Landing page
![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/landingPage.jpg)
  
### Login Page
![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/loginPage.jpg)
  
### Home page
![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/homePage.jpg)

### Top listing page
![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/topListingPage.jpg)   
  
### Cart page  
![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/cartPage.jpg)

### To list item page
 ![image](https://github.com/UCR-CS110/final-project-thesilktrade/blob/main/doc/listingItemPage.jpg)   
  
## Dependencies
Install Node Package Manager (npm). [Helpful Documentation](https://www.npmjs.com/get-npm)

## Contributors
- Sanchit Goel
- Shubham Batra