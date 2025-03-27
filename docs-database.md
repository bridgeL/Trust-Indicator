# Database

This document provide database stufff we have developed.

## Tables

Our database has four tables until now, they are `favorites`, `feedback`, `images` and `user`

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
