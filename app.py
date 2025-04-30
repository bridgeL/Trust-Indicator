from flask import Flask
from database import create_database

app = Flask(__name__)
create_database(app)


import extension
import routes.home
import routes.login
import routes.user_profile
import routes.gallery
import routes.upload
import routes.trust_profile
import routes.aigc_detector
import routes.analysis
import routes.image_detail
import routes.feedback
import routes.whatwedo

extension.init(app)
routes.home.init(app)
routes.login.init(app)
routes.user_profile.init(app)
routes.gallery.init(app)
routes.upload.init(app)
routes.trust_profile.init(app)
routes.aigc_detector.init(app)
routes.analysis.init(app)
routes.image_detail.init(app)
routes.feedback.init(app)
routes.whatwedo.init(app)


extension.print_all_endpoints(app)


if __name__ == "__main__":
    app.run()
