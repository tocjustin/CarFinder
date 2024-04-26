from flask_cors import CORS
import flask_login
from flask import Flask, request, redirect, url_for, render_template, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.testing.suite.test_reflection import users
from werkzeug.security import check_password_hash, generate_password_hash
from scrape import scrape_car_listings

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://myuser:mypassword@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(1024))
    firstName = db.Column(db.String(80), nullable=False)
    lastName = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<User {self.username}>'
    
class Search(db.Model):
    idSearch = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    year = db.Column(db.Integer)
    price_range = db.Column(db.Integer)
    mileage = db.Column(db.Integer)
    zip_code = db.Column(db.Integer)
    maximum_distance = db.Column(db.Integer)

    def __repr__(self):
        return '<Search {self.search}>'

@login_manager.user_loader
def user_loader(user_id):
    return User.query.get(int(user_id))

@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return None
    user = User(email)
    return user

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        # Return a success response
        return jsonify({"success": True, "message": "Login successful"}), 200
    else:
        # Return an error response
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        return jsonify({"message": "Email already registered"}), 400
    new_user = User(
        firstName=data['firstName'],
        lastName=data['lastName'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/protected')
@login_required
def protected():
    return 'Logged in as: ' + flask_login.current_user.id

@app.route('/search')
def search():
    # Extracting parameters from the query string

    brand = request.args.get('brand', '')
    model = request.args.get('model', '')
    year = request.args.get('year', '')
    price = request.args.get('priceRange', '')
    mileage = request.args.get('mileage', '')
    zip_code = request.args.get('zip', '')
    maximum_distance = request.args.get('maximumDistance', '')

    # Call the scraping function with these parameters
    results = scrape_car_listings(brand, model, year, price, mileage, zip_code, maximum_distance)
    return jsonify(results)

@app.route('/saveSearch', methods=['POST'])
def saveSearch():
    data = request.get_json()

    params = data.get('params', {})

    brand = params.get('brand', '')
    model = params.get('model', '')
    year = params.get('year', '')
    price = params.get('price', '')
    mileage = params.get('mileage', '')
    zip_code = params.get('zip', '')
    maximum_distance = params.get('maximumDistance', '')

    if year.isdigit():
        year = int(year)  # Convert year to int
        price = int(price)
        mileage = int(mileage)
        zip_code = int(zip_code)
        maximum_distance = int(maximum_distance)
    else:
        return jsonify({"error": "Invalid or missing year"}), 400

    new_savedsearch = Search(
        brand=brand,
        model=model,
        year=year,
        price_range=price,
        mileage=mileage,
        zip_code=zip_code,
        maximum_distance=maximum_distance
    )

    db.session.add(new_savedsearch)
    db.session.commit()

    return jsonify({"message": "Search registered successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)