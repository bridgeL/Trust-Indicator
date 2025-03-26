# Database

This document provide database stufff we have developed.

## Tables

Our database has four tables until now, they are `favorites`, `feedback`, `images` and `user`

## 1. `favorites` Table

The `favorites` tables define the pictures the relation that a user and their favorite image

| Column Name  | Data Type    | Description                              | Example          |
|-------------|---------------|------------------------------------------|------------------|
| RecordID    | INTEGER       | Unique identifier for each record       | 1                |
| ImageID     | INTEGER       | Identifier for the associated image     | 101              |
| UserID      | INTEGER       | Identifier for the user who owns the record | 5001         |
| FileName    | VARCHAR(120)  | Name of the image file                   | "image1.jpg"     |
| Rate        | INTEGER       | Rating given to the image (e.g., 1-5)    | 4                |
| Is_Favorite | INTEGER       | Flag to mark favorite images (0 = No, 1 = Yes) | 1         |
| Comment     | TEXT          | User's comment on the image              | "Nice picture!"  |
| Create_Date | TEXT          | Date when the record was created         | "2025-03-26"     |


## 2. `feedback` Table

| Column Name    | Data Type    | Description                          | Example               |
|---------------|---------------|--------------------------------------|-----------------------|
| id            | INTEGER       | Unique identifier for each feedback entry | 1                |
| name          | VARCHAR(120)  | Name of the person giving feedback  | "John Doe"           |
| email         | VARCHAR(120)  | Email of the person giving feedback | "john@example.com"   |
| date          | TEXT          | Date when feedback was submitted    | "2025-03-26"         |
| feedback_type | VARCHAR(120)  | Type of feedback (e.g., complaint, suggestion, praise) | "Suggestion" |
| content       | TEXT          | Detailed feedback content           | "Great service!"     |

## 3. `images` Table

The `image` table stores both image files and its related metadata. The metadata like user information, image EXIF metadata and AI-generated probabilities can also be stored in this table.

| id                | INTEGER       | Unique identifier for each image record         | 1                       |
| filename          | VARCHAR(150)  | Name of the image file                          | "photo1.jpg"           |
| data              | BLOB          | Binary image data                               | (Binary Data)           |
| user_email        | VARCHAR(120)  | Email of the user who uploaded the image       | "user@example.com"      |
| ImageTitle        | TEXT          | Title of the image                             | "Sunset View"           |
| ImageDescription  | TEXT          | Description of the image                       | "A beautiful sunset."   |
| UploadDate        | TEXT          | Date when the image was uploaded               | "2025-03-26"           |
| Tag              | TEXT          | Tags associated with the image                 | "Nature, Sunset"        |
| visibility       | VARCHAR(10)   | Visibility status (public/private)             | "public"                |
| ai_prob          | FLOAT         | AI-generated probability score (if applicable) | 0.95                    |
| ColorSpace       | TEXT          | Color space of the image                       | "sRGB"                  |
| Created         | TEXT          | Image creation date (metadata)                 | "2025-03-25"           |
| Make            | TEXT          | Camera manufacturer                            | "Canon"                 |
| Model           | TEXT          | Camera model                                   | "EOS 5D Mark IV"       |
| FocalLength     | FLOAT         | Focal length of the lens (mm)                  | 50.0                    |
| Aperture        | FLOAT         | Aperture setting (f-number)                    | 2.8                     |



