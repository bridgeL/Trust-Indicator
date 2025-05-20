from flask import Blueprint, Flask, jsonify, request
from flask_login import login_required

from database import Image, db
from aigc_detector import get_aigc_detector
from logger import print

bp = Blueprint("aigc_detector", __name__)


def detect_aigc(image_id):
    """
    使用阿里云AIGC检测API检测图片是否为AIGC生成。
    必须提供image_id参数，指定要检测的图片。
    结果将存储在图片的ai_prob字段中。
    """

    # 获取图片数据
    image = Image.query.get(image_id)
    if not image:
        return False

    # 获取图片二进制数据
    image_bytes = image.data

    # 检测图片是否为AIGC生成
    detector = get_aigc_detector()
    is_aigc, confidence, response = detector.detect_image_from_bytes(image_bytes)

    # 将检测结果存储到数据库
    if is_aigc:
        image.ai_prob = confidence / 100.0  # 转换为0-1范围的概率值
    else:
        image.ai_prob = 1 - confidence / 100.0

    print(is_aigc, confidence, response)
    db.session.commit()

    return True


@bp.route("/api/get_aigc", methods=["POST"])
@login_required
def get_aigc():
    """
    路由处理函数，处理AIGC检测请求。
    需要用户登录才能访问。
    """
    try:
        # 获取请求数据
        data = request.get_json()
        image_id = data.get("image_id")

        if not image_id:
            return jsonify({"status": "error", "message": "请提供image_id参数"}), 400

        # 获取图片数据
        image = Image.query.get(image_id)
        if not image:
            return jsonify({"status": "error", "message": "未找到指定图片"}), 404

        # 返回检测结果
        return jsonify(
            {
                "status": "success",
                "confidence": image.ai_prob,
                "image_id": image_id,
            }
        )

    except Exception as e:
        return jsonify({"status": "error", "message": f"AIGC检测失败: {str(e)}"})


def init(app: Flask):
    app.register_blueprint(bp)
