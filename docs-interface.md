# Interface

This document states the relation between front-end and back-end.

## Front-end: Send Request

### Body: Json 

```js
fetch('/change-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        'email': email,
        'old-password': old_pwd,
        'new-password': new_password,
        'confirm-new-password': confirm_password
    })})
```

### Path Parameter 

```js
function loadImage(imageId){
    fetch(`/getimagedetail/${imageId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(imageDetail => {
        function updateMetadataOnPage(metadata) {
```

### Query Parameter

```js
img.onclick = function () {
    location.href = `/imagedetail?source=${image.id}`;
};
```

## Back-end: Handle Request

### Body: Json 

```py
from flask import Flask, request

app = Flask(__name__)

# change password
@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
```

### Path Parameter 

```py
@app.route('/getimagedetail/<int:image_id>')
def getImageDetail(image_id):
    ...
```

### Query Parameter

```py
@app.route('/imagedetail')
def imagedetail():
    source = request.args.get('source', '')
```

