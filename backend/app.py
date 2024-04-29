import flask_login
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from backend.scrape import scrape_car_listings

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://myuser:mypassword@localhost/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

scheduler = BackgroundScheduler()


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(1024))
    firstName = db.Column(db.String(80), nullable=False)
    lastName = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'


class Search(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    year = db.Column(db.Integer)
    price_range = db.Column(db.String(50))
    mileage = db.Column(db.Integer)
    zip_code = db.Column(db.String(10))
    maximum_distance = db.Column(db.Integer)
    user = db.relationship('User', backref=db.backref('alerts', lazy=True))

    def __repr__(self):
        return f'<Search {self.brand} {self.model} {self.year}>'


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(256))
    read = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Notification {self.message}>'


@login_manager.user_loader
def user_loader(user_id):
    return User.query.get(int(user_id))


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    user = User.query.filter_by(email=email).first()
    if user:
        return user
    return None


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"success": True, "message": "Login successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "You have been logged out"}), 200


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


@app.route('/save_search', methods=['POST'])
@login_required
def save_search():
    data = request.get_json()

    try:
        brand = data.get('brand', '')
        model = data.get('model', '')
        year = int(data.get('year', 0))
        price = int(data.get('price', 0))
        mileage = int(data.get('mileage', 0))
        zip_code = data.get('zip', '')
        maximum_distance = int(data.get('maximumDistance', 0))

        new_savedsearch = Search(
            user_id=flask_login.current_user.id,
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

    except ValueError:
        return jsonify({"error": "Invalid input data"}), 400


def check_alerts():
    with app.app_context():
        searches = Search.query.all()
        for search in searches:
            results = scrape_car_listings(
                search.brand, search.model, search.year,
                search.price_range, search.mileage,
                search.zip_code, search.maximum_distance
            )
            for result in results:
                message = f"Car found: {result['title']} at {result['price']}\n{result['dealer_url']}"
                # Try to add a new notification, skip if already exists
                add_notification(search.user_id, message)


def add_notification(user_id, message):
    # Check if the same notification message already exists for the user
    existing_notification = Notification.query.filter_by(user_id=user_id, message=message).first()
    if existing_notification:
        print("Notification already exists for this user with the same message.")
        return False

    # Create a new notification since it doesn't exist
    new_notification = Notification(
        user_id=user_id,
        message=message,
        read=False
    )
    db.session.add(new_notification)
    db.session.commit()
    print("New notification added.")
    return True


@app.route('/notifications', methods=['GET'])
def get_notifications():
    # Fetch notifications for the currently logged-in user
    notifications = Notification.query.filter_by(user_id=flask_login.current_user.id).all()
    notifications_data = [{
        'id': notification.id,
        'message': notification.message,
        'read': notification.read
    } for notification in notifications]

    print(notifications_data)
    return jsonify(notifications_data), 200


@app.route('/notifications/mark-read', methods=['POST'])
def mark_notification_as_read():
    data = request.get_json()
    notification_id = data.get('id')
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user.id).first()

    if notification:
        notification.read = True
        db.session.commit()
        return jsonify({"success": True, "message": "Notification marked as read"}), 200
    else:
        return jsonify({"success": False, "message": "Notification not found"}), 404


scheduler.add_job(func=check_alerts, trigger='interval', hours=12)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True)
