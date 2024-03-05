from flask import jsonify
from marshmallow import ValidationError

from app import app, jwt, api

from app.resources.user import UserRegister, UserLogin, UserDetailsResource, \
    UserPasswordUpdateResource, UserProfileUpdateResource, UserDeleteResource
from app.resources.product import ProductResource, ProductByUserResource, ProductUpdateResource, \
    DeleteProductResource, GetAllProductResource
# from app.resources.comment import CommentResource, CommentByProductResource, \
#     CommentUpdateResource, DeleteCommentResource
# from app.resources.notification import NotificationResource

from app.resources.image import Avatar, AvatarUpload, ImageUpload, Image


api.add_resource(UserRegister, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(UserDetailsResource, "/user-details/<int:user_id>")
api.add_resource(UserPasswordUpdateResource, "/update-password")
api.add_resource(UserProfileUpdateResource,
                 '/user-update-profile/<int:user_id>')
api.add_resource(UserDeleteResource, "/user-delete/<int:user_id>")

api.add_resource(ProductResource, "/upload-product")
api.add_resource(ProductByUserResource, "/user-products/<int:_userid>")
api.add_resource(ProductUpdateResource, "/product-update/<int:_id>")
api.add_resource(DeleteProductResource, "/delete-product/<int:_id>")

api.add_resource(GetAllProductResource, "/get-all")

# api.add_resource(CommentResource, "/create_comment")
# api.add_resource(CommentByProductResource,
#                  "/product_comments/<int:_productid>")
# api.add_resource(CommentUpdateResource, "/update_comment/<int:_id>")
# api.add_resource(DeleteCommentResource, "/delete_comment/<int:_id>")

# api.add_resource(NotificationResource, "/create_notification")

api.add_resource(ImageUpload, "/upload/image/<int:user_id>")
api.add_resource(Image, "/image/<string:filename>/<int:user_id>")
api.add_resource(AvatarUpload, "/upload/avatar")
api.add_resource(Avatar, "/avatar/<int:user_id>")


@app.route('/')
@app.route('/index')
def index():
    return 'This is my first flask project!!'
