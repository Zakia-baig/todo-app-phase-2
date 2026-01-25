from sqlmodel import Session, select
from typing import Optional

from ..models.user_model import User, UserCreate, UserUpdate
from ..auth.auth_handler import AuthHandler


class UserService:
    def __init__(self, session: Session):
        self.session = session
        self.auth_handler = AuthHandler()

    def create_user(self, user_create: UserCreate) -> User:
        """Create a new user."""
        # Check if user with this email already exists
        existing_user = self.session.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            raise ValueError(f"User with email {user_create.email} already exists")

        # Hash the password
        hashed_password = self.auth_handler.get_password_hash(user_create.password)

        # Create the user
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            password_hash=hashed_password
        )

        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)

        return db_user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email."""
        return self.session.exec(select(User).where(User.email == email)).first()

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get a user by ID."""
        return self.session.exec(select(User).where(User.id == user_id)).first()

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        user = self.get_user_by_email(email)
        if not user or not self.auth_handler.verify_password(password, user.password_hash):
            return None
        return user

    def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """Update a user."""
        user = self.get_user_by_id(user_id)
        if not user:
            return None

        # Update fields if they are provided
        if user_update.email is not None:
            user.email = user_update.email
        if user_update.username is not None:
            user.username = user_update.username
        if user_update.password is not None:
            user.password_hash = self.auth_handler.get_password_hash(user_update.password)

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False

        self.session.delete(user)
        self.session.commit()
        return True