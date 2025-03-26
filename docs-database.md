# Database

This document provide database stufff we have developed.

## Tables

Our database has four tables until now, they are `favorites`, `feedback`, `images` and `user`

## `favorites` Table

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
