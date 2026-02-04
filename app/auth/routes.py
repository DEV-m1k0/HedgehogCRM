from flask import render_template, request, redirect
from flask_login import login_user, current_user

from app.auth import bp

from app.models import User


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print(request.form.get('email'))
        email = request.form.get('email')
        password = request.form.get('password')

        user: User = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)
            return redirect('/')

    return render_template('auth/login.html')


@bp.route('/register')
def register():
    return render_template('auth/register.html')