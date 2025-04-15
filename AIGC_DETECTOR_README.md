# AIGC 检测器

本模块用于检测图像是否为AI生成内容(AIGC)。

## 环境变量设置

为了使AIGC检测器正常工作，您需要设置以下环境变量:

### 阿里云凭据

```bash
# Windows 命令行
set ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
set ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret

# Linux/macOS
export ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key_id
export ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_access_key_secret
```

### ImgBB API密钥

```bash
# Windows 命令行
set IMGBB_API_KEY=your_imgbb_api_key

# Linux/macOS
export IMGBB_API_KEY=your_imgbb_api_key
```

## 注意事项

1. 请勿将您的API密钥和访问凭据直接硬编码在源代码中
2. 请勿将这些敏感信息提交到版本控制系统(如Git)
3. 您可以考虑使用.env文件和python-dotenv库来管理环境变量，但确保.env文件已添加到.gitignore中

## 使用示例

```python
import os
from io import BytesIO
from PIL import Image
from aigc_detector import AigcDetector

# 设置环境变量
os.environ["ALIBABA_CLOUD_ACCESS_KEY_ID"] = "your_access_key_id"
os.environ["ALIBABA_CLOUD_ACCESS_KEY_SECRET"] = "your_access_key_secret"
os.environ["IMGBB_API_KEY"] = "your_imgbb_api_key"

# 创建检测器实例
detector = AigcDetector()

# 从文件加载图像
image_path = "path/to/your/image.jpg"
with open(image_path, "rb") as f:
    image_bytes = f.read()

# 检测图像
is_aigc, confidence = detector.is_aigc_image(image_bytes)

print(f"是AI生成图像: {is_aigc}, 置信度: {confidence}%")
``` 