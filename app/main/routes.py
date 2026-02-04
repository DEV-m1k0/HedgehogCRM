from flask import render_template, redirect
from flask_login import login_required, current_user

from app.main import bp

@bp.route('/')
@login_required
def index():
    return render_template('base.html', user=current_user)