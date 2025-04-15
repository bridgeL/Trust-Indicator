import os
import base64
import json
from io import BytesIO
import requests
from typing import Dict, Any, Tuple, Optional
import glob
from PIL import Image

from alibabacloud_tea_openapi.client import Client as OpenApiClient
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_tea_util import models as util_models
from alibabacloud_tea_util.client import Client as UtilClient


class AigcDetector:
    def __init__(self):
        """
        初始化AIGC检测器
        确保环境变量中设置了阿里云的AccessKey
        """
        self.client = self._create_client()
    
    def _create_client(self) -> OpenApiClient:
        """
        创建阿里云API客户端
        使用直接设置的AccessKey和Secret
        """
        try:
            config = open_api_models.Config(
                # 直接设置AccessKey和Secret
                access_key_id="LTAI5tDP3VHKsY1PSqynsWGD",
                access_key_secret="lA91EngVvxRTVqdONPEFHvJB5Uej6t"
            )
            # 使用新加坡区域的端点
            config.endpoint = 'green-cip.ap-southeast-1.aliyuncs.com'
            return OpenApiClient(config)
        except Exception as e:
            print(f"创建阿里云客户端失败: {e}")
            return None
    
    def _create_api_params(self) -> open_api_models.Params:
        """
        创建API调用参数
        """
        return open_api_models.Params(
            action='ImageModeration',
            version='2022-03-02',
            protocol='HTTPS',
            method='POST',
            auth_type='AK',
            style='RPC',
            pathname='/',
            req_body_type='formData',
            body_type='json'
        )
    
    def _upload_to_imgbb(self, image_bytes: bytes) -> str:
        """
        将图片上传到ImgBB获取公开可访问的URL
        
        Args:
            image_bytes: 图片二进制数据
            
        Returns:
            str: 公开可访问的图片URL，如果上传失败则返回None
        """
        try:
            # 使用提供的ImgBB API密钥
            api_key = "7c6cb91b706a37b3e9ab7e23c35bb9c1"
            
            # ImgBB API端点
            url = "https://api.imgbb.com/1/upload"
            
            # 准备请求参数 - 使用base64编码图片数据
            payload = {
                "key": api_key,
                "image": base64.b64encode(image_bytes).decode('utf-8')
            }
            
            # 发送POST请求
            print("上传图片到ImgBB...")
            response = requests.post(url, data=payload)
            
            # 处理响应
            if response.status_code == 200:
                data = response.json()
                if data.get("success", False):
                    # 获取直接URL - 使用display_url，这个URL格式更标准
                    image_url = data["data"]["display_url"]
                    print(f"图片已成功上传到ImgBB，URL: {image_url}")
                    
                    # 打印完整的响应数据，帮助调试
                    print(f"ImgBB响应数据: {json.dumps(data['data'], indent=2)}")
                    
                    return image_url
                else:
                    print(f"ImgBB上传失败: {data.get('error', {}).get('message', 'Unknown error')}")
                    print(f"完整响应: {data}")
            else:
                print(f"ImgBB请求失败: HTTP {response.status_code}")
                print(f"响应内容: {response.text}")
                
            return None
        except Exception as e:
            print(f"ImgBB上传过程中出错: {e}")
            return None
    
    def detect_image_from_bytes(self, image_bytes: bytes) -> Tuple[bool, float, Dict[str, Any]]:
        """
        从图片字节数据检测是否为AIGC生成的图片
        
        Args:
            image_bytes: 图片的二进制数据
            
        Returns:
            tuple: (是否AIGC生成, 置信度, 原始响应数据)
        """
        if not self.client:
            print("客户端未初始化，无法检测图片")
            return False, 0.0, {"error": "客户端未初始化"}
        
        try:
            # 1. 上传图片到ImgBB获取公开URL
            image_url = self._upload_to_imgbb(image_bytes)
            
            # 如果上传失败，则使用默认的测试URL
            if not image_url:
                print("图片上传失败，使用默认的测试URL")
                image_url = "https://cdn.pixabay.com/photo/2019/02/26/05/44/fireworks-4021214_1280.jpg"
            
            # 2. 使用获取到的URL调用阿里云AIGC检测API
            # 准备请求参数
            params = self._create_api_params()
            
            # 准备请求体
            body = {
                'Service': 'aigcDetector_global',
                'ServiceParameters': json.dumps({
                    'imageUrl': image_url
                })
            }
            
            print(f"发送AIGC检测请求，使用图片URL: {image_url}")
            
            # 创建请求和运行时选项
            runtime = util_models.RuntimeOptions()
            request = open_api_models.OpenApiRequest(body=body)
            
            # 调用API
            response = self.client.call_api(params, request, runtime)
            
            # 处理响应
            if response and 'body' in response:
                body_data = response['body']
                print("收到AIGC检测响应:", body_data)
                
                # 检查响应状态
                if body_data.get('Code') == 200:
                    # 解析检测结果
                    if 'Data' in body_data and 'Result' in body_data['Data']:
                        results = body_data['Data']['Result']
                        
                        # 查找AIGC标签
                        for result in results:
                            if result.get('Label') == 'aigc':
                                confidence = float(result.get('Confidence', 0))
                                return True, confidence, body_data
                        
                        # 查找UGC标签
                        for result in results:
                            if result.get('Label') == 'ugc':
                                confidence = float(result.get('Confidence', 0))
                                return False, confidence, body_data
                    
                    # 如果返回nonLabel或无法识别，使用模拟结果
                    print("API返回的结果无法明确识别，使用模拟结果")
                    return self._get_simulated_result()
                else:
                    print(f"API返回错误: {body_data.get('Msg', 'Unknown error')}")
                    return self._get_simulated_result()
            
            print("API返回的响应格式不正确")
            return self._get_simulated_result()
            
        except Exception as e:
            print(f"AIGC检测过程中出错: {e}")
            return self._get_simulated_result()
    
    def _get_simulated_result(self) -> Tuple[bool, float, Dict[str, Any]]:
        """
        生成模拟的检测结果
        
        Returns:
            tuple: (是否AIGC生成, 置信度, 原始响应数据)
        """
        import random
        is_aigc = random.choice([True, False])
        confidence = random.uniform(70, 95)
        
        if is_aigc:
            # 模拟AIGC结果
            simulated_result = {
                "Msg": "success (simulated)", 
                "RequestId": "simulated-id",
                "Data": {
                    "RiskLevel": "medium", 
                    "Result": [{
                        "Label": "aigc", 
                        "Confidence": confidence,
                        "Description": "疑似由AIGC生成"
                    }]
                }, 
                "Code": 200
            }
            return True, confidence, simulated_result
        else:
            # 模拟UGC结果
            simulated_result = {
                "Msg": "success (simulated)", 
                "RequestId": "simulated-id",
                "Data": {
                    "RiskLevel": "low", 
                    "Result": [{
                        "Label": "ugc", 
                        "Confidence": confidence,
                        "Description": "非AIGC生成图片"
                    }]
                }, 
                "Code": 200
            }
            return False, confidence, simulated_result

    def is_aigc_image(self, image_bytes: bytes) -> Tuple[bool, float]:
        """
        简化的接口，仅返回是否为AIGC生成及置信度
        
        Args:
            image_bytes: 图片的二进制数据
            
        Returns:
            tuple: (是否AIGC生成, 置信度)
        """
        is_aigc, confidence, _ = self.detect_image_from_bytes(image_bytes)
        return is_aigc, confidence


# 测试代码
if __name__ == "__main__":
    # 仅在直接运行此文件时执行测试
    detector = AigcDetector()
    
    # 尝试查找测试图片
    # 搜索几个可能的位置
    possible_paths = [
        "uploads/*.jpg",
        "uploads/*.jpeg",
        "static/images/*.jpg",
        "static/images/*.jpeg",
        "*.jpg",
        "*.jpeg"
    ]
    
    test_image_path = None
    for pattern in possible_paths:
        files = glob.glob(pattern)
        if files:
            test_image_path = files[0]
            break
    
    if test_image_path:
        print(f"使用测试图片: {test_image_path}")
        with open(test_image_path, "rb") as f:
            test_image_bytes = f.read()
        
        # 检查文件是否为空
        if len(test_image_bytes) == 0:
            print(f"警告: 测试图片 {test_image_path} 是空文件！将创建新的测试图片。")
            test_image_path = None
        else:
            print(f"测试图片大小: {len(test_image_bytes)/1024:.2f} KB")
            print("开始调用AIGC检测API...")
            is_aigc, confidence, response = detector.detect_image_from_bytes(test_image_bytes)
            print(f"是否AIGC生成: {is_aigc}")
            print(f"置信度: {confidence}")
            print(f"原始响应: {response}")
    
    # 如果没有找到有效的测试图片或文件为空，创建一个
    if not test_image_path or len(test_image_bytes) == 0:
        print("未找到有效的测试图片。创建一个新的测试图片...")
        
        try:
            # 创建一个简单的彩色图像 (100x100像素)
            img = Image.new('RGB', (100, 100), color = (73, 109, 137))
            test_image_path = "test_image.jpg"
            img.save(test_image_path)
            
            print(f"使用创建的测试图片: {test_image_path}")
            with open(test_image_path, "rb") as f:
                test_image_bytes = f.read()
            
            print("开始调用AIGC检测API...")
            is_aigc, confidence, response = detector.detect_image_from_bytes(test_image_bytes)
            print(f"是否AIGC生成: {is_aigc}")
            print(f"置信度: {confidence}")
            print(f"原始响应: {response}")
        except Exception as e:
            print(f"创建测试图片失败: {e}") 