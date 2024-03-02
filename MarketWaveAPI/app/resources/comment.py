# from datetime import datetime, timedelta
# import json
# from flask import request
# from flask_jwt_extended import (
#     get_jwt,
#     get_jwt_identity,
#     jwt_required
# )
# from flask_restful import Resource
# from app.models import Comments
# from app.schemas.comment import CommentSchema

# comment_schema = CommentSchema()
# comment_list_schema = CommentSchema(many=True)


# class CommentResource(Resource):
#     @classmethod
#     def post(cls):
#         comment = comment_schema.load(request.get_json())

#         comment.save_to_db()

#         return {"message": "Comment created successfully."}, 201


# class CommentUpdateResource(Resource):
#     @classmethod
#     def put(cls, _id: int):
#         comment_json = request.get_json()

#         comment = Comments.find_by_id(_id)

#         if comment:
#             comment.message = comment_json["message"]
#             comment.save_to_db()
#         else:
#             return {"message": "comment not found"}, 404

#         return comment_schema.dump(comment), 200


# class DeleteCommentResource(Resource):
#     @classmethod
#     def delete(cls, _ID: int):
#         comment = Comments.find_by_id(_ID)
#         if comment:
#             comment.delete_from_db()
#             return {"message": "comment deleted."}
#         return {"message": "comment not found."}, 404


# class CommentByProductResource(Resource):
#     @classmethod
#     def get(cls, _productid: int):
#         comment = Comments.find_by_productid(_productid)
#         if not comment:
#             return {"message": "comment not found."}, 404
#         return comment_list_schema.dump(comment), 200
