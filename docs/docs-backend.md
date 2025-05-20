# API Documentation

## **User Authentication**

### **`POST /register`**

**Description**: Register a new user.

**Request Type**: JSON

**Request Params**:

| Name      | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| UserName  | string | The username of the new user.              |
| Email     | string | The user's email address (must be unique). |
| LegalName | string | The user's full legal name.                |
| Password  | string | The password for the user account.         |

**Response**:

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| message | string | Confirmation message indicating success or failure. |

---

### **`POST /login_function`**

**Description**: Login a user.

**Request Type**: JSON

**Request Params**:

| Name     | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| username | string | The username of the user.                      |
| password | string | The password associated with the user account. |

**Response**:

| Name    | Type   | Description                    |
| ------- | ------ | ------------------------------ |
| message | string | Authentication result message. |

---

### **`POST /change-password`**

**Description**: Change user password.

**Request Type**: JSON

**Request Params**:

| Name                 | Type   | Description                       |
| -------------------- | ------ | --------------------------------- |
| email                | string | The user's email address.         |
| old-password         | string | The user's current password.      |
| new-password         | string | The new password to be set.       |
| confirm-new-password | string | Confirmation of the new password. |

**Response**:

| Name    | Type   | Description                      |
| ------- | ------ | -------------------------------- |
| status  | string | Indicates success or failure.    |
| message | string | Status message of the operation. |

---

### **`POST /reset-password`**

**Description**: Reset user password.

**Request Type**: JSON

**Request Params**:

| Name        | Type   | Description                            |
| ----------- | ------ | -------------------------------------- |
| email       | string | The user's email address.              |
| newPassword | string | The new password for the user account. |

**Response**:

| Name    | Type   | Description                      |
| ------- | ------ | -------------------------------- |
| status  | string | Indicates success or failure.    |
| message | string | Status message of the operation. |

---

### **`POST /send-code`**

**Description**: Send a verification code to a user's email.

**Request Type**: JSON

**Request Params**:

| Name  | Type   | Description                                      |
| ----- | ------ | ------------------------------------------------ |
| email | string | The email address to send the verification code. |

**Response**:

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| message | string | Status of the request.                              |
| token   | string | Encoded JWT token containing the verification code. |

---

### **`POST /verify-code`**

**Description**: Verify the email verification code.

**Request Type**: JSON

**Request Params**:

| Name  | Type   | Description                               |
| ----- | ------ | ----------------------------------------- |
| token | string | The JWT token received from `/send-code`. |
| code  | string | The 4-digit verification code.            |

**Response**:

| Name    | Type   | Description                  |
| ------- | ------ | ---------------------------- |
| message | string | Verification status message. |
| status  | string | `"success"` or `"error"`.    |

---

## **User Profile Management**

### **`GET /getcurrentuserimages`**

**Description**: Get all images uploaded by the current user.

**Response**:

| Name     | Type   |
| -------- | ------ |
| id       | int    |
| filename | string |

### **`POST /change_profile_photo`**

**Description**: Change the profile photo of the current user.

**Request Type**: Form Data (requires authentication)

**Request Params**:

| Name           | Type | Description                         |
| -------------- | ---- | ----------------------------------- |
| selected_image | int  | The ID of the profile photo (1-16). |

---

### **`GET /get_current_user`**

**Description**: Get the currently logged-in user.

**Response**:

| Name  | Type   | Description                              |
| ----- | ------ | ---------------------------------------- |
| name  | string | The username of the logged-in user.      |
| email | string | The email address of the logged-in user. |

---

## **Image Management**

### **`POST /updateImageType`**

**Description**: Update image tag type.

**Request Type**: Form Data

**Request Params**:

| Name      | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| imageId   | int    | The unique identifier of the image. |
| imageType | string | The new tag type for the image.     |

**Response**:

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| status | string | Status of the update operation. |

---

### **`POST /api/updateImageVisibility`**

**Description**: Update the visibility of an image.

**Request Type**: JSON

**Request Params**:

| Name       | Type   | Description                         |
| ---------- | ------ | ----------------------------------- |
| image_id   | int    | The unique identifier of the image. |
| visibility | string | private / public.                   |

**Response**:

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| status | string | Status of the update operation. |

---

### **`POST /api/updateImageDesc`**

**Description**: Update the description of an image.

**Request Type**: Form Data (requires authentication)

**Request Params**:

| Name     | Type   | Description                         |
| -------- | ------ | ----------------------------------- |
| image_id | int    | The unique identifier of the image. |
| desc     | string | The new description for the image.  |

**Response**:

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| status | string | Status of the update operation. |

---

### **`GET /getimages`**

**Description**: Retrieve all images.

**Response**:

| Name     | Type   | Description     |
| -------- | ------ | --------------- |
| id       | int    | Image ID.       |
| filename | string | Image filename. |

---

### **`GET /getimagedetail/<int:image_id>`**

**Description**: Fetch image metadata.

**Request Type**: Path Parameter

**Response**:

| Name             | Type     | Description                                                          |
| ---------------- | -------- | -------------------------------------------------------------------- |
| id               | int      | Unique image identifier.                                             |
| filename         | string   | Image filename.                                                      |
| user_email       | string   | Email of the user who uploaded the image.                            |
| ImageTitle       | string   | Title of the image.                                                  |
| ImageDescription | string   | Description of the image.                                            |
| UploadDate       | datetime | Timestamp of when the image was uploaded.                            |
| ai_prob          | float    | AI detection probability score (if applicable).                      |
| Tag              | string   | Image category given by uploader: `AIGC`, `Original`, `Manipulation` |
| ColorSpace       | string   | Color space of the image.                                            |
| Created          | string   | Date and time when the image was created.                            |
| Make             | string   | Camera manufacturer.                                                 |
| Model            | string   | Camera model.                                                        |
| FocalLength      | float    | Focal length used in the image.                                      |
| Aperture         | float    | Aperture setting of the image.                                       |
| Exposure         | float    | Exposure setting of the image.                                       |
| ISO              | int      | ISO sensitivity setting.                                             |
| Flash            | int      | Flash setting (1 for used, 0 for not used).                          |
| ImageWidth       | int      | Width of the image in pixels.                                        |
| ImageLength      | int      | Height of the image in pixels.                                       |
| Altitude         | float    | Altitude data (if available).                                        |
| LatitudeRef      | string   | Latitude reference (N/S).                                            |
| Latitude         | float    | Latitude coordinate.                                                 |
| LongitudeRef     | string   | Longitude reference (E/W).                                           |
| Longitude        | float    | Longitude coordinate.                                                |

---

### **`POST /uploadImage`**

**Description**: Upload an image file.

**Request Type**: Form Data (requires authentication)

**Request Params**:

| Name | Type | Description                                  |
| ---- | ---- | -------------------------------------------- |
| file | file | The image file to be uploaded (JPEG format). |

---

### **`GET /image/<int:image_id>`**

**Description**: Retrieve an image file by its ID.

**Request Type**: Path Parameter

**Response**:

- Returns the image file in **JPEG** format as an attachment.
- If the image does not exist, returns **404 Not Found**.

---

### **`GET /getImage`**

**Description**: Retrieve an image file for analysis.

**Response**:

- If an image ID exists in the session, returns the image file.
- If no image ID exists, returns a **400 Bad Request**.
- If the image is not found, returns **404 Not Found**.

**Response**:

- Returns the image file in **JPEG** format.

---

## **Image Sorting and Filtering**

### **`GET /images/sortByTimeDesc`**

**Description**: Retrieve images sorted by upload time in descending order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description                                 |
| ---- | ------ | ------------------------------------------- |
| tag  | string | (Optional) Filter images by a specific tag. |

---

### **`GET /images/sortByTimeAsce`**

**Description**: Retrieve images sorted by upload time in ascending order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description                                 |
| ---- | ------ | ------------------------------------------- |
| tag  | string | (Optional) Filter images by a specific tag. |

---

### **`GET /images/sortByTag`**

**Description**: Retrieve images filtered by a specific tag. If no tag is provided, all images are returned in random order.

**Request Type**: Query Parameters

**Request Params**:

| Name | Type   | Description                             |
| ---- | ------ | --------------------------------------- |
| tag  | string | (Optional) The tag to filter images by. |

**Response**:

A JSON **array** of objects. Each object has the following structure:

| Name        | Type   | Description         |
| ----------- | ------ | ------------------- |
| id          | int    | Favorite record ID. |
| filename    | string | Image filename.     |
| description | string | Image description.  |

---

## **Favorites Management**

### **`POST /addToFavourite`**

**Description**: Add an image to favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description                                         |
| -------- | ---- | --------------------------------------------------- |
| image_id | int  | The unique identifier of the image to be favorited. |

---

### **`POST /checkFavourite`**

**Description**: Check if an image is favorited by the current user.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description                         |
| -------- | ---- | ----------------------------------- |
| image_id | int  | The unique identifier of the image. |

---

### **`POST /deleteFavourite`**

**Description**: Remove an image from favorites.

**Request Type**: JSON

**Request Params**:

| Name     | Type | Description                                                  |
| -------- | ---- | ------------------------------------------------------------ |
| image_id | int  | The unique identifier of the image to remove from favorites. |

### **`GET /getAllFavouritesByUser`**

**Description**: Retrieve all favorite images of the currently logged-in user.

**Response**:

| Name     | Type   | Description         |
| -------- | ------ | ------------------- |
| id       | int    | Favorite record ID. |
| filename | string | Image filename.     |

---
