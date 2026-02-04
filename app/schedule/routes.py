from app.schedule import bp

from flask import render_template
from flask_login import login_required, current_user

@bp.route('/')
@login_required
def schedule():
    return render_template('schedule.html', user=current_user)