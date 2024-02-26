# User Endpoints  
## Register New User - '/register'
### Request:
  - username: String
  - password: String

### Response:
  - json.message

## Login User - '/login'
### Request:
  - username: String
  - password: String

### Response:
  - cookie.jwt (refreshToken, httpOnly)
  - json.jwt (accessToken)

## Logout User - '/logout'
### Request:
  - cookie.jwt (optional)

### Response:
  - clearCookie.jwt (refreshToken, httpOnly)
  - json.message

## Refresh Token - '/refresh'
### Request:
  - cookies.jwt (refreshToken, httpOnly)

### Response:
  - json.jwt (accessToken)

## Change Password - '/passwordChange'
### Request:
  - _id: String
  - oldPass: String
  - newPass: String

### Response:
  - json.message

## Change Username - '/usernameChange'
### Request:
  - _id: String
  - newUsername: String

### Response:
  - json.message

## Delete User Account - '/accountDelete'
### Request:
  - _id: String
  - password: String

### Response:
  - clearCookie.jwt (refreshToken, httpOnly)
  - json.message
  
<br></br>

# Admin Endpoints
## GET - /admin
### Request:
  - params._id: String || params.username: String

### Response:
  - json.data

## POST - /admin
### Request:

### Response:

## UPDATE - /admin
### Request:

### Response:

## DELETE - /admin
### Request:
  - _id: String (admin)
  - params._id: String (user)

### Response:
  - json.message


<br></br>

# Other
## RegEx
- username: (/^([\w@#-_=+!£$%^&*]{8,255})$/)
- password: (/^(?=.*[A-Z])(?=.*[a-z])([\w@#-_=+!£$%^&*]{8,255})$/)
- _id: (/^([0-9a-f]{24})$/)
