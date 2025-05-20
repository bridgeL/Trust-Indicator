# AIGC Detector

This module is used to detect whether images are AI-generated content (AIGC).

## Environment Variables Setup

To make the AIGC detector work properly, you need to set the following environment variables:

### Alibaba Cloud Credentials

```bash
# Windows Command Line
set ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
set ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret

# Linux/macOS
export ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
export ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret
```

### ImgBB API Key

```bash
# Windows Command Line
set IMGBB_API_KEY=your_imgbb_api_key

# Linux/macOS
export IMGBB_API_KEY=your_imgbb_api_key
```

### Using Environment Variables with Python

You can also set the environment variables directly in your Python script:

```python
import os

os.environ["ALIBABA_CLOUD_ACCESS_KEY_ID"] = "your_access_key_id"
os.environ["ALIBABA_CLOUD_ACCESS_KEY_SECRET"] = "your_access_key_secret"
os.environ["IMGBB_API_KEY"] = "your_imgbb_api_key"
```

### Using .env Files

Alternatively, you can use a .env file with the python-dotenv library:

1. Install python-dotenv:
```bash
pip install python-dotenv
```

2. Create a .env file in your project root:

```bash
# Windows Command Line
set ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
set ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret

# Linux/macOS
export ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
export ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret

set IMGBB_API_KEY=your_imgbb_api_key

# Linux/macOS
export IMGBB_API_KEY=your_imgbb_api_key
```

## Important Notes

1. Do not hardcode your API keys and access credentials directly in the source code
2. Do not commit these sensitive information to version control systems (like Git)
3. Make sure to add .env files to your .gitignore

## Fallback to Simulated Results

If the API credentials are not provided or the API call fails, the detector will automatically fall back to using simulated results. This is useful for testing or when you don't have access to the Alibaba Cloud API.

## Usage Examples

### Basic Usage

```python
from aigc_detector import AigcDetector

# Create detector instance (make sure environment variables are set)
detector = AigcDetector()

# Load image from file
image_path = "path/to/your/image.jpg"
with open(image_path, "rb") as f:
    image_bytes = f.read()

# Detect image
is_aigc, confidence = detector.is_aigc_image(image_bytes)

print(f"Is AI-generated image: {is_aigc}, Confidence: {confidence}%")
```

### Using with the dotenv Library

```python
import os
from dotenv import load_dotenv
from aigc_detector import AigcDetector

# Load environment variables from .env file
load_dotenv()

# Create detector instance
detector = AigcDetector()

# Load and detect image
with open("path/to/your/image.jpg", "rb") as f:
    image_bytes = f.read()

is_aigc, confidence = detector.is_aigc_image(image_bytes)
print(f"Is AI-generated image: {is_aigc}, Confidence: {confidence}%")
```

### Getting Detailed Results

```python
from aigc_detector import AigcDetector

detector = AigcDetector()

with open("path/to/your/image.jpg", "rb") as f:
    image_bytes = f.read()

# Get detailed results including the original API response
is_aigc, confidence, detailed_response = detector.detect_image_from_bytes(image_bytes)

print(f"Is AI-generated: {is_aigc}")
print(f"Confidence: {confidence}%")
print(f"Detailed response: {detailed_response}")
``` 