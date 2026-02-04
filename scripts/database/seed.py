from app import create_app, db
from app import models

def seed_data():
    app = create_app()
    with app.app_context():
        if models.Role.query.count() == 0:
            roles = [
                models.Role(name='anonymous'),
                models.Role(name='admin'),
                models.Role(name='teacher'),
                models.Role(name='manager')
            ]

            for role in roles:
                db.session.add(role)

            db.session.commit()

        if models.User.query.count() == 0:
            users = [
                models.User(
                    first_name='Anonymous',
                    second_name='Anonymous',
                    patronymic='Anonymous',
                    email='anonymous@localhost',
                    password='anonymous',
                    role_id=1
                ),
                models.User(
                    first_name='Admin',
                    second_name='Admin',
                    patronymic='Admin',
                    email='admin@localhost',
                    password='admin',
                    role_id=2,
                    is_accepted=True
                ),
                models.User(
                    first_name='Teacher',
                    second_name='Teacher',
                    patronymic='Teacher',
                    email='teacher@localhost',
                    password='teacher',
                    role_id=3,
                    is_accepted=True
                ),
                models.User(
                    first_name='Manager',
                    second_name='Manager',
                    patronymic='Manager',
                    email='manager@localhost',
                    password='manager',
                    role_id=4,
                    is_accepted=True
                )
            ]

            for user in users:
                db.session.add(user)

            db.session.commit()

if __name__ == '__main__':
    seed_data()