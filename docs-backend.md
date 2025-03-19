# API Documentation

## **User Authentication**

### **`POST /register`**

**Description**: Register a new user.

**Request Type**: JSON

**Request Params**:

| Name      | Type   |
| --------- | ------ |
| UserName  | string |
| Email     | string |
| LegalName | string |
| Password  | string |

**Response**:

| Name    | Type   |
| ------- | ------ |
| message | string |

### **`POST /login_function`**

**Description**: Login a user.

**Request Type**: JSON

**Request Params**:

| Name     | Type   |
| -------- | ------ |
| username | string |
| password | string |

**Response**:

| Name    | Type   |
| ------- | ------ |
| message | string |

### **`POST /change-password`**

**Description**: Change user password.

**Request Type**: JSON

**Request Params**:

| Name                 | Type   |
| -------------------- | ------ |
| email                | string |
| old-password         | string |
| new-password         | string |
| confirm-new-password | string |

**Response**:

| Name    | Type   |
| ------- | ------ |
| status  | string |
| message | string |

### **`POST /reset-password`**

**Description**: Reset user password.

**Request Type**: JSON

**Request Params**:

| Name        | Type   |
| ----------- | ------ |
| email       | string |
| newPassword | string |

**Response**:

| Name    | Type   |
| ------- | ------ |
| status  | string |
| message | string |

### **`GET /logout`**

**Description**: Logout user and redirect to home page.

**Response**: Redirect to `/`

## **Image Management**

### **`POST /uploadImage`**

**Description**: Upload an image.

**Request Type**: Multipart Form Data

**Request Params**:

| Name | Type |
| ---- | ---- |
| file | File |

**Response**:

| Name      | Type   |
| --------- | ------ |
| message   | string |
| filename  | string |
| file_size | int    |
| file_type | string |
| metadata  | object |
| id        | int    |

### **`GET /getimagedetail/<int:image_id>`**

**Description**: Fetch image metadata.

**Request Type**: URL Parameter

**Response**:

| Name             | Type     |
| ---------------- | -------- |
| id               | int      |
| filename         | string   |
| user_email       | string   |
| ImageTitle       | string   |
| ImageDescription | string   |
| UploadDate       | datetime |
| ai_prob          | float    |
| Tag              | string   |
| ColorSpace       | string   |
| Created          | string   |
| Make             | string   |
| Model            | string   |
| FocalLength      | float    |
| Aperture         | float    |
| Exposure         | float    |
| ISO              | int      |
| Flash            | int      |
| ImageWidth       | int      |
| ImageLength      | int      |
| Altitude         | float    |
| LatitudeRef      | string   |
| Latitude         | float    |
| LongitudeRef     | string   |
| Longitude        | float    |

### **`POST /updateImageType`**

**Description**: Update image tag type.

**Request Type**: Form Data

**Request Params**:

| Name      | Type   |
| --------- | ------ |
| imageId   | int    |
| imageType | string |

**Response**:

| Name   | Type   |
| ------ | ------ |
| status | string |

### **`GET /getimages`**

**Description**: Get all images.

**Request Type**: None

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |

### **`GET /images/sortByTimeDesc`**

**Description**: Get images sorted by time (descending).

**Request Type**: URL Params

**Request Params**:

| Name | Type   |
| ---- | ------ |
| tag  | string |

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |

### **`GET /images/sortByTimeAsce`**

**Description**: Get images sorted by time (ascending).

**Request Type**: URL Params

**Request Params**:

| Name | Type   |
| ---- | ------ |
| tag  | string |

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |

### **`GET /images/sortByTag`**

**Description**: Retrieve images filtered by tag and user. If no tag is provided, all images owned by the user are returned in random order.

**Request Type**: URL Params

**Request Params**:

| Name    | Type   |
| ------- | ------ |
| tag     | string |

**Response**:

| Name        | Type   |
| ----------- | ------ |
| id          | int    |
| filename    | string |
| description | string |

### **`POST /addToFavourite`**

**Description**: Add an image to favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type |
| -------- | ---- |
| image_id | int  |

**Response**:

| Name    | Type   |
| ------- | ------ |
| message | string |

### **`POST /checkFavourite`**

**Description**: Check if an image is favorited.

**Request Type**: JSON

**Request Params**:

| Name     | Type |
| -------- | ---- |
| image_id | int  |

**Response**:

| Name        | Type |
| ----------- | ---- |
| isFavourite | bool |

### **`POST /deleteFavourite`**

**Description**: Remove an image from favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type |
| -------- | ---- |
| image_id | int  |

**Response**:

| Name    | Type   |
| ------- | ------ |
| message | string |

### **`POST /api/updateImageDesc`**

**Description**: update the description of the image

**Request Type**: JSON

**Request Params**:

| Name     | Type   |
| -------- | ------ |
| image_id | int    |
| desc     | string |

**Response**:

| Name    | Type   |
| ------- | ------ |
| success | bool   |
| message | string |

## **User Profile Management**

### **`GET /get_current_user`**

**Description**: Get current logged-in user.

**Response**:

| Name  | Type   |
| ----- | ------ |
| name  | string |
| email | string |

### **`GET /getcurrentuserimages`**

**Description**: Get all images uploaded by the current user.

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |
