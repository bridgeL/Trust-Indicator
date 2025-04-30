from flask import Blueprint, Flask, jsonify, request
from flask_login import login_required

from database import Image, db
from aigc_detector import AigcDetector

bp = Blueprint("aigc_detector", __name__)


@bp.route("/api/detect_aigc", methods=["POST"])
@login_required
def detect_aigc():
    """
    使用阿里云AIGC检测API检测图片是否为AIGC生成。
    必须提供image_id参数，指定要检测的图片。
    结果将存储在图片的ai_prob字段中。
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

        # 获取图片二进制数据
        image_bytes = image.data

        # 检测图片是否为AIGC生成
        detector = AigcDetector()
        is_aigc, confidence, response = detector.detect_image_from_bytes(image_bytes)

        # 将检测结果存储到数据库
        image.ai_prob = confidence / 100.0  # 转换为0-1范围的概率值
        db.session.commit()

        # 返回检测结果
        return jsonify(
            {
                "status": "success",
                "is_aigc": is_aigc,
                "confidence": confidence,
                "image_id": image_id,
                "detail": response,
            }
        )

    except Exception as e:
        return jsonify({"status": "error", "message": f"AIGC检测失败: {str(e)}"}), 500


def init(app: Flask):
    app.register_blueprint(bp)
