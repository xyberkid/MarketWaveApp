from datetime import datetime, timedelta
import json
from flask import request
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required
)
from flask_restful import Resource
from app.models import Products
from app.schemas.product import ProductSchema

product_schema = ProductSchema()
product_list_schema = ProductSchema(many=True)


class ProductResource(Resource):
    @classmethod
    def post(cls):
        product = product_schema.load(request.get_json())

        product.save_to_db()

        return {"message": "Product Upload Successfully."}, 201


class ProductUpdateResource(Resource):
    @classmethod
    def put(cls, _id: int):
        product_json = request.get_json()

        product = Products.find_by_id(_id)

        if product:
            product.productname = product_json["productname"]
            product.productdescription = product_json["productdescription"]
            product.productprice = product_json["productprice"]
            product.productimage = product_json["productimage"]
            product.status = product_json["status"]
            product.location = product_json["location"]
            product.agentname = product_json["agentname"]
            product.agentnumber = product_json["agentnumber"]
            product.save_to_db()
        else:
            return {"message": "product not found"}, 404

        return product_schema.dump(product), 200


class ProductByUserResource(Resource):
    @classmethod
    def get(cls, _userid: int):
        product = Products.find_by_userid(_userid)
        if not product:
            return {"message": "no product found."}, 404
        return product_list_schema.dump(product), 200


class DeleteProductResource(Resource):
    @classmethod
    def delete(cls, _id: int):
        product = Products.find_by_id(_id)
        if product:
            product.delete_from_db()
            return {"message": "product deleted."}
        return {"message": "product not found."}, 404


class GetAllProductResource(Resource):
    @classmethod
    def get(cls):
        products = Products.query.all()

        results = product_list_schema.dump(products)
        return {"products": results}
