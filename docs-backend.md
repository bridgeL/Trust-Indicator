# API Documentation

## **User Authentication**

### **`POST /register`**

**Description**: Register a new user.

**Request Type**: JSON

**Request Params**:

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| UserName  | string | The username of the new user. |
| Email     | string | The user's email address (must be unique). |
| LegalName | string | The user's full legal name. |
| Password  | string | The password for the user account. |

**Example Request**:
```json
{
  "UserName": "john_doe",
  "Email": "john@example.com",
  "LegalName": "John Doe",
  "Password": "securepassword123"
}
```

**Response**:

| Name    | Type   | Description |
| ------- | ------ | ----------- |
| message | string | Confirmation message indicating success or failure. |

**Example Response**:
```json
{
  "message": "User registered successfully."
}
```

---

### **`POST /login_function`**

**Description**: Login a user.

**Request Type**: JSON

**Request Params**:

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| username | string | The username of the user. |
| password | string | The password associated with the user account. |

**Example Request**:
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response**:

| Name    | Type   | Description |
| ------- | ------ | ----------- |
| message | string | Authentication result message. |

**Example Response**:
```json
{
  "message": "Login successful."
}
```

---

### **`POST /change-password`**

**Description**: Change user password.

**Request Type**: JSON

**Request Params**:

| Name                 | Type   | Description |
| -------------------- | ------ | ----------- |
| email                | string | The user's email address. |
| old-password         | string | The user's current password. |
| new-password         | string | The new password to be set. |
| confirm-new-password | string | Confirmation of the new password. |

**Example Request**:
```json
{
  "email": "john@example.com",
  "old-password": "securepassword123",
  "new-password": "newsecurepassword456",
  "confirm-new-password": "newsecurepassword456"
}
```

**Response**:

| Name    | Type   | Description |
| ------- | ------ | ----------- |
| status  | string | Indicates success or failure. |
| message | string | Status message of the operation. |

**Example Response**:
```json
{
  "status": "success",
  "message": "Password changed successfully."
}
```

---

### **`POST /reset-password`**

**Description**: Reset user password.

**Request Type**: JSON

**Request Params**:

| Name        | Type   | Description |
| ----------- | ------ | ----------- |
| email       | string | The user's email address. |
| newPassword | string | The new password for the user account. |

**Example Request**:
```json
{
  "email": "john@example.com",
  "newPassword": "newpassword789"
}
```

**Response**:

| Name    | Type   | Description |
| ------- | ------ | ----------- |
| status  | string | Indicates success or failure. |
| message | string | Status message of the operation. |

**Example Response**:
```json
{
  "status": "success",
  "message": "Password reset successfully."
}
```

---

## **User Profile Management**


### **`GET /getcurrentuserimages`**

**Description**: Get all images uploaded by the current user.

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |


### **`GET /get_current_user`**

**Description**: Get the currently logged-in user.

**Response**:

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| name  | string | The username of the logged-in user. |
| email | string | The email address of the logged-in user. |

**Example Response**:
```json
{
  "name": "john_doe",
  "email": "john@example.com"
}
```

## **Image Management**

### **`POST /updateImageType`**

**Description**: Update image tag type.

**Request Type**: Form Data

**Request Params**:

| Name      | Type   | Description |
| --------- | ------ | ----------- |
| imageId   | int    | The unique identifier of the image. |
| imageType | string | The new tag type for the image. |

**Example Request**:
```json
{
  "imageId": 42,
  "imageType": "Nature"
}
```

**Response**:

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| status | string | Status of the update operation. |

**Example Response**:
```json
{
  "status": "success"
}
```

---

### **`POST /api/updateImageDesc`**

**Description**: Update the description of an image.

**Request Type**: JSON

**Request Params**:

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| image_id | int    | The unique identifier of the image. |
| desc     | string | The new description for the image. |

**Example Request**:
```json
{
  "image_id": 42,
  "desc": "A beautiful sunset over the mountains."
}
```

**Response**:

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| status | string | Status of the update operation. |

**Example Response**:
```json
{
  "status": "success"
}
```

---


### **`GET /getimages`**

**Description**: Retrieve all images.

**Response**:

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| id       | int    | Image ID. |
| filename | string | Image filename. |

**Example Response**:
```json
[
  {
    "id": 42,
    "filename": "image123.jpg"
  },
  {
    "id": 43,
    "filename": "image456.png"
  }
]
```

---


### **`GET /getimagedetail/<int:image_id>`**

**Description**: Fetch image metadata.

**Request Type**: Path Parameter

**Response**:

| Name             | Type     | Description |
| ---------------- | -------- | ----------- |
| id               | int      | Unique image identifier. |
| filename         | string   | Image filename. |
| user_email       | string   | Email of the user who uploaded the image. |
| ImageTitle       | string   | Title of the image. |
| ImageDescription | string   | Description of the image. |
| UploadDate       | datetime | Timestamp of when the image was uploaded. |
| ai_prob          | float    | AI detection probability score (if applicable). |
| Tag              | string   | Image category or tag. |
| ColorSpace       | string   | Color space of the image. |
| Created          | string   | Date and time when the image was created. |
| Make             | string   | Camera manufacturer. |
| Model            | string   | Camera model. |
| FocalLength      | float    | Focal length used in the image. |
| Aperture         | float    | Aperture setting of the image. |
| Exposure         | float    | Exposure setting of the image. |
| ISO              | int      | ISO sensitivity setting. |
| Flash            | int      | Flash setting (1 for used, 0 for not used). |
| ImageWidth       | int      | Width of the image in pixels. |
| ImageLength      | int      | Height of the image in pixels. |
| Altitude         | float    | Altitude data (if available). |
| LatitudeRef      | string   | Latitude reference (N/S). |
| Latitude         | float    | Latitude coordinate. |
| LongitudeRef     | string   | Longitude reference (E/W). |
| Longitude        | float    | Longitude coordinate. |

**Example Request**:
```sh
GET http://example.com/getimagedetail/42
```

**Example Response**:
```json
{
  "id": 42,
  "filename": "image123.jpg",
  "user_email": "john@example.com",
  "ImageTitle": "Sunset View",
  "ImageDescription": "A beautiful sunset over the ocean.",
  "UploadDate": "2024-03-19T10:00:00Z",
  "Tag": "Nature",
  "ColorSpace": "sRGB",
  "Created": "2024-03-18T08:00:00Z",
  "Make": "Canon",
  "Model": "EOS 5D Mark IV",
  "FocalLength": 50.0,
  "Aperture": 2.8,
  "Exposure": 1/250,
  "ISO": 100,
  "Flash": 0,
  "ImageWidth": 6000,
  "ImageLength": 4000,
  "Altitude": 12.5,
  "LatitudeRef": "N",
  "Latitude": 37.7749,
  "LongitudeRef": "W",
  "Longitude": -122.4194
}
```

---

## **Image Sorting and Filtering**

### **`GET /images/sortByTimeDesc`**

**Description**: Retrieve images sorted by upload time in descending order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description |
| ---- | ------ | ----------- |
| tag  | string | (Optional) Filter images by a specific tag. |

**Example Request**:
```sh
GET http://example.com/images/sortByTimeDesc?tag=Nature
```

**Example Response**:
```json
[
  { "id": 42, "filename": "image123.jpg" },
  { "id": 43, "filename": "image456.png" }
]
```

---

### **`GET /images/sortByTimeAsce`**

**Description**: Retrieve images sorted by upload time in ascending order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description |
| ---- | ------ | ----------- |
| tag  | string | (Optional) Filter images by a specific tag. |

**Example Request**:
```sh
GET http://example.com/images/sortByTimeAsce?tag=Portrait
```

**Example Response**:
```json
[
  { "id": 44, "filename": "image789.jpg" },
  { "id": 45, "filename": "image567.png" }
]
```

---

### **`GET /images/sortByTag`**

**Description**: Retrieve images filtered by a specific tag. If no tag is provided, all images are returned in random order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description |
| ---- | ------ | ----------- |
| tag  | string | (Optional) The tag to filter images by. |

**Example Request**:
```sh
GET http://example.com/images/sortByTag?tag=Wildlife
```

**Example Response**:
```json
[
  { "id": 50, "filename": "wildlife1.jpg", "description": "A lion in the wild" },
  { "id": 51, "filename": "wildlife2.jpg", "description": "A herd of elephants" }
]
```

---

## **Favorites Management**

### **`POST /addToFavourite`**

**Description**: Add an image to favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description |
| -------- | ---- | ----------- |
| image_id | int  | The unique identifier of the image to be favorited. |

**Example Request**:
```json
{
  "image_id": 42
}
```

**Example Response**:
```json
{
  "message": "Image added to favorites successfully."
}
```

---

### **`POST /checkFavourite`**

**Description**: Check if an image is favorited by the current user.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description |
| -------- | ---- | ----------- |
| image_id | int  | The unique identifier of the image. |

**Example Request**:
```json
{
  "image_id": 42
}
```

**Example Response**:
```json
{
  "isFavourite": true
}
```

---

### **`POST /deleteFavourite`**

**Description**: Remove an image from favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description |
| -------- | ---- | ----------- |
| image_id | int  | The unique identifier of the image to remove from favorites. |

**Example Request**:
```json
{
  "image_id": 42
}
```

**Example Response**:
```json
{
  "message": "Favorite removed successfully."
}
```