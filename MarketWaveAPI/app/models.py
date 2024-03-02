from typing import List
from datetime import datetime, date, timedelta
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
import hashlib
import pytz
import moment


from app import app, db


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    firstname = db.Column(db.String(50))
    lastname = db.Column(db.String(50))
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    gender = db.Column(db.String(50))
    country = db.Column(db.String(250))
    address = db.Column(db.String(250))
    phone = db.Column(db.String(50))
    password = db.Column(db.String(150))
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()

    def set_password(self, password: str):
        self.password = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password, password)

    @classmethod
    def find_by_id(cls, _id: int) -> "Users":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_username(cls, username: str) -> "Users":
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_email(cls, email: str) -> "Users":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_phone(cls, phone: str) -> "Users":
        return cls.query.filter_by(phone=phone).first()

    @classmethod
    def find_by_user_data(cls, user_data):
        user = cls.query.filter_by(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
            email=user_data.email
        ).first()

        return user


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    productname = db.Column(db.String(250), nullable=False)
    productdescription = db.Column(db.String(1000), nullable=False)
    productimage = db.Column(db.String(500), nullable=False)
    productcategory = db.Column(db.String(500))
    productprice = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(250))
    agentname = db.Column(db.String(250))
    agentnumber = db.Column(db.String(250))
    publishdate = db.Column(db.Date, index=True, nullable=False)
    status = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, _id: int) -> "Products":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_by_userid(cls, _userid: int) -> "Products":
        return cls.query.filter(cls.user_id == _userid).all()


# class Comments(db.Model):
#     id = db.Column(db.Integer, primary_key=True, index=True)
#     user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
#     product_id = db.Column(db.Integer, db.ForeignKey(
#         "Products.id"), nullable=False)
#     message = db.Column(db.String(1000), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.now())

#     def save_to_db(self) -> None:
#         db.session.add(self)
#         db.session.commit()

#     def delete_from_db(self) -> None:
#         db.session.delete(self)
#         db.session.commit()

#     @classmethod
#     def find_by_id(cls, _id: int) -> "Comments":
#         return cls.query.filter_by(id=_id).first()

#     @classmethod
#     def find_by_userid(cls, _userid: int) -> "Comments":
#         return cls.query.filter_by(user_id=_userid).first()

#     @classmethod
#     def find_by_productid(cls, _productid: int) -> "Products":
#         return cls.query.filter(cls.product_id == _productid).all()


# class Notifications(db.Model):
#     id = db.Column(db.Integer, primary_key=True, index=True)
#     product_id = db.Column(db.Integer, db.ForeignKey(
#         "Products.id"), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.now())

#     def save_to_db(self) -> None:
#         db.session.add(self)
#         db.session.commit()

#     def delete_from_db(self) -> None:
#         db.session.delete(self)
#         db.session.commit()

#     @classmethod
#     def find_by_id(cls, _id: int) -> "Notifications":
#         return cls.query.filter_by(id=_id).first()

#     @classmethod
#     def find_by_productid(cls, _product_id: int) -> "Notifications":
#         return cls.query.filter_by(product_id=_product_id).first()
