# Authorization-node-mongo
Small Backend project written in node v8 & the db is mongo v 4.0

Basically this has 3 main APIS : 
1) Server side validation with : 
  a) firstName, lastName, countryCode, phoneNumber, gender, birthdate, avatar are all required 
  b) email is optional
  c) phone Number must be in E.164 format
  d) birthdate must be in YYYY-MM-DD format and in the past 
  e)avatar must be jpg, jpeg or png 
  A successful response would reply with : 
  { "id": 1, "first_name": "Ali", "last_name": "Gamal", "country_code": "EG", "phone_number":
  "01001234567", "gender": "male", "birthdate": "1988-03-29" }

  A response with all possible errors would look like : 
  { "errors": { "first_name": [ { "error": "blank" } ], "last_name": [ { "error": "blank" } ], "country_code":
  [ { "error": "inclusion" } ], "phone_number": [ { "error": "blank" }, { "error": "not_a_number" }, { "error":
  "not_exist" }, { "error": "invalid" }, { "error": "taken" }, { "error": "too_short", "count": 10 }, { "error":
  "too_long", "count": 15 } ], "gender": [ { "error": "inclusion" } ], "birthdate": [ { "error": "blank" },
  { "error": "in_the_future" } ], "avatar": [ { "error": "blank" }, { "error": "invalid_content_type" } ], "email": [
  { "error": "taken" }, { "error": "invalid" } ] } }
  
2) An end point that accepts password and phone number responds with an authToken for the next API 

3) A Post request that takes phoneNumber, authToken & status would create a status object linked to the user object and respond 
   appropiately if an error occurs or bad request. 
   
The App requires a GET call to localhost:3000 to initialize the db with the connection string ( this coul dbe avoided if we make it an IIFE) 

The app has test cases written using jasmine however all test are in the same file and are run with npm test 

Npm start runs the app. 


