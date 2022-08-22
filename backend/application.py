from db import db
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from graphene_file_upload.flask import FileUploadGraphQLView
import os
import yaml

basedir = os.path.abspath(os.path.dirname(__file__))

application = Flask(__name__)
CORS(application)
application.debug = True

application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
application.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
application.config['SECRET_KEY'] = 'retrera-interview'

db.init_app(application)
migrate = Migrate(application, db)

manager = Manager(application)
manager.add_command('db', MigrateCommand)


@application.route('/health')
def health():
    return "Success"


if __name__ == '__main__':
    from schema import schema
    application.add_url_rule(
        '/graphql',
        view_func=FileUploadGraphQLView.as_view(
            'graphql',
            schema=schema,
            graphiql=True  # for having the GraphiQL interface
        )
    )
    application.run(host="0.0.0.0")
