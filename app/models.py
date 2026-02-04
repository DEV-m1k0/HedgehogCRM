from typing import List, Optional

from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app import login_manager, db

from flask_login import UserMixin

from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

class Role(db.Model):
    __tablename__ = 'roles'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    def __init__(self, name: str):
        self.name = name
    
    def __repr__(self):
        return f'<Role {self.name}>'

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    second_name: Mapped[str] = mapped_column(String(255), nullable=False)
    patronymic: Mapped[str] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey('roles.id'), nullable=False, default=1)

    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=datetime.now())
    last_login: Mapped[DateTime] = mapped_column(DateTime, nullable=True)

    def __init__(self,
                 first_name: str,
                 second_name: str,
                 patronymic: str,
                 email: str,
                 password: str,
                 is_accepted: bool = False,
                 role_id: int = 1
                ):
        self.first_name = first_name
        self.second_name = second_name
        self.patronymic = patronymic
        self.email = email
        self.__set_password(password)
        self.is_accepted = is_accepted

        self.role_id = role_id

    def __repr__(self):
        return f'<User {self.email}>'
    
    def __set_password(self, password: str):
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)
    
    def get_role(self) -> Role:
        role = Role.query.get(self.role_id)
        if role.name == 'anonymous':
            return "Неизвестный пользователь"
        elif role.name == 'admin':
            return "Администратор"
        elif role.name == 'teacher':
            return "Преподаватель"
        elif role.name == 'manager':
            return "Менеджер"
        return None    

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
login_manager.user_loader(load_user)