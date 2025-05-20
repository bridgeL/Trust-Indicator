# 📡 Request Type

This document describes the relation between front-end and back-end, categorized by request data type.

---

## 🔸 JSON Request

### ✅ Front-end

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
    })
});
```

### ✅ Back-end

```py
@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    ...
```

---

## 🔸 Path Parameter

### ✅ Front-end

```js
function loadImage(imageId) {
    fetch(`/getimagedetail/${imageId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(imageDetail => {
        function updateMetadataOnPage(metadata) {
            ...
        }
    });
}
```

### ✅ Back-end

```py
@app.route('/getimagedetail/<int:image_id>')
def getImageDetail(image_id):
    ...
```

---

## 🔸 Query Parameter

### ✅ Front-end

```js
img.onclick = function () {
    location.href = `/imagedetail?source=${image.id}`;
};
```

### ✅ Back-end

```py
@app.route('/imagedetail')
def imagedetail():
    source = request.args.get('source', '')
    ...
```

---

## 🔸 Form Data

### ✅ Front-end

```js
const formData = new FormData();
formData.append('imageId', imageId);
formData.append('imageType', selectedType);

fetch('/updateImageType', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        console.log('Image type updated successfully.');
        window.location.href = "/analysis";
    } else {
        console.log('Failed to update image type.');
    }
})
.catch(error => {
    console.error('Error:', error);
});
```

### ✅ Back-end

```py
@app.route('/updateImageType', methods=['POST'])
@login_required
def update_image_type():
    image_id = request.form['imageId']
    image_type = request.form['imageType']
    session['image_id_for_analysis'] = image_id

    image = Image.query.get(image_id)
    if image:
        image.Tag = image_type
        db.session.commit()
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'failed'})
```
