# Page

This document lists the pages we have developed till now.

| **API Endpoint**          | **Description**      |
| ------------------------- | -------------------- |
| **`GET /`**               | Home page            |
| **`GET /signup`**         | Signup page          |
| **`GET /login`**          | Login page           |
| **`GET /upload`**         | Upload page          |
| **`GET /userprofile`**    | User profile page    |
| **`GET /whatwedo`**       | About us page        |
| **`GET /changepassword`** | Change password page |
| **`GET /analysis`**       | Image analysis page  |
| **`GET /imagedetail`**    | Image details page   |
| **`GET /feedback`**       | Feedback page        |
| **`GET /gallery`**        | Gallery page         |


```mermaid 
graph TD;
    Home[Home Page] -->|Click 'Sign Up'| Signup[Signup Page]
    Home -->|Click 'Sign in'| Login[Login Page]
    Signup -->|Submit Form| Login
    Login -->|Successful Login| Home
```

```mermaid 
graph TD;
    Home[Home Page] -->|Click 'Gallery'| Gallery[Gallery Page]
    Gallery -->|Click 'Image'| ImageDetail[Image Detail Page]
    Home -->|Click 'User Avatar'| UserProfile[User Profile Page]
```

```mermaid 
graph TD;
    Home[Home Page] -->|Click 'Upload'| CheckLogin{Is User Logged In?}
    CheckLogin -- No --> Login[Login Page]
    CheckLogin -- Yes --> Upload[Upload Page]
    Upload -->|Click 'Analyse'| AnalysisPage[Analysis Page]
```