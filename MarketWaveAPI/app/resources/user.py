from datetime import datetime, timedelta
import json
from flask import request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required
)
from flask_restful import Resource
from app.models import Users
from app.schemas.user import UserSchema

user_schema = UserSchema()


class UserRegister(Resource):
    @classmethod
    def post(cls):
        user = user_schema.load(request.get_json())

        if user.find_by_username(user.username):
            return {"message": "A user with that username already exists."}, 400

        if user.find_by_email(user.email):
            return {"message": "A user with that email already exists."}, 400

        if user.find_by_phone(user.phone):
            return {"message": "A user with that phone number already exists."}, 400

        user.set_password(user.password)

        user.save_to_db()

        return {"message": "User created successfully."}, 201


class UserLogin(Resource):
    @classmethod
    def post(cls):
        user_data = user_schema.load(request.get_json())

        user = Users.find_by_email(user_data.email)

        if user and user.check_password(user_data.password):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "email": user.email,
                "lastname": user.lastname,
                "firstname": user.firstname,
                "username": user.username,
                "phone": user.phone,
                "id": user.id
            }, 200
        return {"message": "Invalid credentials"}, 401


class UserDetailsResource(Resource):
    @classmethod
    def get(cls, user_id: int):
        user = Users.find_by_id(user_id)
        if not user:
            return {"message": "user not found"}, 404
        return user_schema.dump(user), 200


class UserPasswordUpdateResource(Resource):
    @classmethod
    def put(cls):
        user_data = user_schema.load(request.get_json())

        user = Users.find_by_email(user_data.email)

        if user:
            user.set_password(user_data.password)
            user.save_to_db()
        else:
            return {"message": "user not found"}, 404
        return user_schema.dump(user), 200


class UserDeleteResource(Resource):
    @classmethod
    def delete(cls, user_id: int):
        user = Users.find_by_id(user_id)

        if not user:
            return {"message": "user not found"}, 404
        user.delete_from_db()
        return {"message": "user deleted successfully"}, 200


class UserProfileUpdateResource(Resource):
    @jwt_required()
    def put(cls, user_id: int):
        current_user_id = get_jwt_identity()
        user_data = user_schema.load(request.get_json())

        if current_user_id != user_id:
            return {"message": "Unauthorized"}, 401

        user = Users.find_by_user_data(user_data)

        if not user:
            return {"message": "User not found"}, 404

        if user_data.email and user.email != user_data.email:
            if Users.find_by_email(user_data.email):
                return {"message": "A user with that email already exists."}, 400
            user.email = user_data.email

        if user_data.phone and user.phone != user_data.phone:
            if Users.find_by_phone(user_data.phone):
                return {"message": "A user with that phone number already exists."}, 400
            user.phone = user_data.phone

        if user_data.firstname:
            user.firstname = user_data.firstname

        if user_data.lastname:
            user.lastname = user_data.lastname

        if user_data.username:
            user.username = user_data.username

        user.save_to_db()

        return user_schema.dump(user), 200
