# Database

This document provide database stufff we have developed.

## Tables

Our database has four tables until now, they are `favorites`, `feedback`, `images` and `user`

---

## 1. Table Name: `user`

### Description:
The `user` table stores information about system users, including login credentials, profile details, and administrative status.

### Columns:

| Column Name       | Data Type      | Constraints                          | Description                          |
|------------------|--------------|--------------------------------------|--------------------------------------|
| `id`            | `Integer`     | `Primary Key`                        | Unique identifier for each user.    |
| `UserName`      | `String(80)`  | `NOT NULL`                           | Display name of the user.           |
| `Email`         | `String(120)` | `NOT NULL, UNIQUE`                   | User's email address (used for login). |
| `Password`      | `String(100)` |                                      | Hashed password for authentication. |
| `LegalName`     | `String(100)` |                                      | User’s full legal name.             |
| `ProfilePhotoNO`| `String(100)` |                                      | Reference to the user’s profile photo. |
| `Is_Admin`      | `Boolean`     | `DEFAULT FALSE`                      | Indicates if the user has admin privileges. |

### Primary Key: 
- `id`

### Indexes:
- `Email` is indexed as it is marked `UNIQUE`, which helps optimize lookups.

---

## 2. Table Name: `favorites`

### Description:
The `favorites` table stores users' favorite images, including additional metadata like ratings, comments, and timestamps.

### Columns:

| Column Name    | Data Type      | Constraints                            | Description                         |
|---------------|--------------|----------------------------------------|-------------------------------------|
| `RecordID`    | `Integer`     | `Primary Key`                          | Unique identifier for each record. |
| `ImageID`     | `Integer`     | `Foreign Key → images.id, NOT NULL`    | References the associated image.   |
| `UserID`      | `Integer`     | `Foreign Key → user.id, NOT NULL`      | References the user who favorited the image. |
| `FileName`    | `String(120)` |                                        | Stores the filename of the image. |
| `Rate`        | `Integer`     |                                        | User-defined rating for the image. |
| `Is_Favorite` | `Integer`     |                                        | Indicates if the image is marked as a favorite (1 = Yes, 0 = No). |
| `Comment`     | `Text`        |                                        | User's comment on the image. |
| `Create_Date` | `Text`        |                                        | Timestamp of when the favorite record was created. |

### Primary Key:
- `RecordID`

### Foreign Keys:
- `ImageID` → References `images.id`
- `UserID` → References `user.id`

### Indexes:
- `UserID` and `ImageID` should be indexed for efficient lookups.

---

## 3. Table Name: `feedback`

### Description:
The `feedback` table stores user feedback submissions, including user details, feedback type, and content.

### Columns:

| Column Name      | Data Type      | Constraints                     | Description                          |
|-----------------|--------------|---------------------------------|--------------------------------------|
| `id`           | `Integer`     | `Primary Key`                   | Unique identifier for each feedback entry. |
| `name`         | `String(120)` | `NOT NULL`                      | Name of the user providing feedback. |
| `email`        | `String(120)` | `NOT NULL`                      | Email address of the user. |
| `date`         | `Text`        |                                 | Timestamp of when the feedback was submitted. |
| `feedback_type`| `String(120)` |                                 | Type of feedback (e.g., complaint, suggestion). |
| `content`      | `Text`        |                                 | The detailed feedback content. |

### Primary Key:
- `id`

### Indexes:
- `email` should be indexed. 

---

## 4. Table Name: `images`

### Description:
The `images` table stores image files along with metadata, user association, and AI-related attributes.

### Columns:

| Column Name       | Data Type        | Constraints                              | Description                          |
|------------------|----------------|------------------------------------------|--------------------------------------|
| `id`            | `Integer`       | `Primary Key`                            | Unique identifier for each image. |
| `filename`      | `String(150)`   |                                          | Name of the image file. |
| `data`          | `LargeBinary`   |                                          | Binary data representing the image. |
| `user_email`    | `String(120)`   | `Foreign Key → user.Email, NOT NULL`     | Email of the user who uploaded the image. |
| `ImageTitle`    | `Text`          |                                          | Title of the image. |
| `ImageDescription` | `Text`       |                                          | Description or caption for the image. |
| `UploadDate`    | `Text`          |                                          | Date when the image was uploaded. |
| `Tag`           | `Text`          |                                          | Tags associated with the image for searchability. |
| `visibility`    | `String(10)`    | `DEFAULT 'public'`                       | Image visibility status (`public` or `private`). |
| `ai_prob`       | `Float`         |                                          | AI-generated probability for categorization. |
| `ColorSpace`    | `Text`          |                                          | Image color space information. |
| `Created`       | `Text`          |                                          | Date when the image was originally created. |
| `Make`          | `Text`          |                                          | Camera manufacturer. |
| `Model`         | `Text`          |                                          | Camera model used to take the image. |
| `FocalLength`   | `Float`         | `Nullable`                               | Focal length of the camera lens. |
| `Aperture`      | `Float`         | `Nullable`                               | Aperture setting at the time of capture. |
| `Exposure`      | `Float`         | `Nullable`                               | Exposure time (shutter speed). |
| `ISO`           | `Float`         | `Nullable`                               | ISO sensitivity setting. |
| `Flash`         | `Float`         | `Nullable`                               | Whether the flash was used (1 = Yes, 0 = No). |
| `ImageWidth`    | `Float`         | `Nullable`                               | Width of the image in pixels. |
| `ImageLength`   | `Float`         | `Nullable`                               | Length of the image in pixels. |
| `Altitude`      | `Text`          | `Nullable`                               | Altitude where the image was taken. |
| `LatitudeRef`   | `Text`          |                                          | Latitude reference (N/S). |
| `Latitude`      | `Text`          | `Nullable`                               | Latitude coordinate. |
| `LongitudeRef`  | `Text`          |                                          | Longitude reference (E/W). |
| `Longitude`     | `Text`          | `Nullable`                               | Longitude coordinate. |

### Primary Key:
- `id`

### Foreign Keys:
- `user_email` → References `user.Email` (links images to the user who uploaded them).

### Indexes:
- `user_email` should be indexed for efficient querying of images by user.

---

# Database Uses

### **`POST /addToFavourite`**

**Description**: Adds an image to the user's favorites list.

**Database Usage**:

| Table      | Action  | Purpose |
|------------|--------|---------|
| `favorites` | `SELECT` | Check if the image is already in the user's favorites. |
| `images`   | `SELECT` | Retrieve the image filename to store in `favorites`. |
| `favorites` | `INSERT` | Add a new favorite entry for the user with `Is_Favorite = 1`. |

---

### **`POST /deleteFavourite`**

**Description**: Removes an image from the user's favorites list.

**Database Usage**:

| Table      | Action  | Purpose |
|------------|--------|---------|
| `favorites` | `SELECT` | Verify if the image exists in the user's favorites. |
| `favorites` | `DELETE` | Remove the image from the user's favorites. |