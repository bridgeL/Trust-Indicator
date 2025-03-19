# Page  

This document lists the pages we have developed till now.  

## Signin / Login Page  

- **Router**: `/login`  
- **API**:  
  - `/login_function`  

## Change Password Page  

- **Router**: `/changepassword`  
- **API**:  
  - `/change-password`  
  - `/send-code`  
  - `/verify-code`  
  - `/reset-password`  

## Logout Page  

- **Router**: `/logout`  
- **Note**: It redirects to the home page  

## Signup Page  

- **Router**: `/signup`  
- **API**:  
  - `/register`  

## Upload Page  

- **Router**: `/upload`  
- **API**:  
  - `/uploadImage`  
  - `/updateImageType`  

## Gallery Page  

- **Router**: `/gallery`  
- **API**:  
  - `/images/sortByTimeDesc`  
  - `/images/sortByTimeAsce`  
  - `/images/sortByTag`  
  - `/image/<int:image_id>`  
  - `/getimages`  

## Analyse Page  

- **Router**: `/analysis`  
- **Note**:  
  - Accessed via the upload page (click analyze button → this page)  

## Image Detail Page  

- **Router**: `/imagedetail`  
- **API**:  
  - `/addToFavourite`  
  - `/checkFavourite`  
  - `/deleteFavourite`  
  - `/getimagedetail/<int:image_id>`  

## Home / Index Page  

- **Router**: `/`  

## Whatwedo Page  

- **Router**: `/whatwedo`  

## Feedback Page  

- **Router**: `/feedback`  
- **API**:  
  - `/submit_feedback`  
  - `/get_current_user`

## UserProfile Page  

- **Router**: `/userprofile`  
- **API**:  
  - `/getcurrentuserimages`  
  - `/getAllFavouritesByUser`  
  - `/deleteFavourite`  
  - `/change_profile_photo`

