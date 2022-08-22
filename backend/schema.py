import csv
from db import db
from email_validator import validate_email, EmailNotValidError
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene_file_upload.scalars import Upload
from graphql import GraphQLError
import json
from models import User


class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node, )
        exclude_fields = ('password_hash')


class SignUp(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        name = graphene.String(required=True)
    user = graphene.Field(lambda: UserObject)
    auth_token = graphene.String()

    def mutate(self, info, **kwargs):
        email = kwargs.get('email')
        try:
            valid = validate_email(email)
            email = valid.email
        except EmailNotValidError as e:
            raise GraphQLError(e)
        user = User.query.filter_by(email=email).first()
        if user is not None:
            raise GraphQLError("User already exists. Please try logging in.")
        user = User(email=email)
        user.set_password(kwargs.get('password'))
        user.name = kwargs.get('name')
        try:
            db.session.add(user)
            db.session.commit()
        except:
            db.session.rollback()
        return SignUp(user=user,
                      auth_token=user.encode_auth_token(user.uuid).decode())


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
    user = graphene.Field(lambda: UserObject)
    auth_token = graphene.String()

    def mutate(self, info, **kwargs):
        user = User.query.filter_by(email=kwargs.get('email')).first()
        if user is None or not user.check_password(kwargs.get('password')):
            raise GraphQLError("Invalid Credentials")
        return Login(user=user,
                     auth_token=user.encode_auth_token(user.uuid).decode())


class Mutation(graphene.ObjectType):
    signup = SignUp.Field()
    login = Login.Field()

schema = graphene.Schema(mutation=Mutation)