from app import ma
from app.models import Products


class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Products
        dumb_only = ("id",)
        include_fk = True
        load_instance = True
