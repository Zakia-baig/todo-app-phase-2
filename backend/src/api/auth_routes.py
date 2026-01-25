from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Any
from pydantic import BaseModel

from ..database.connection import get_session
from ..models.user_model import User, UserCreate, UserRead
from ..auth.auth_handler import AuthHandler
from ..utils.exceptions import DuplicateResourceException
from ..utils.logger import app_logger

router = APIRouter()
auth_handler = AuthHandler()


# Request schema for login
class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user."""
    # Check if user with this email already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise DuplicateResourceException("User", "email", user.email)

    # Hash the password
    hashed_password = auth_handler.get_password_hash(user.password)

    # Create the user in DB
    db_user = User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password  # Ensure User model has this field
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Generate JWT token for new user
    token = auth_handler.create_access_token(data={"sub": str(db_user.id)})

    app_logger.info("User created", user_id=db_user.id, email=db_user.email)
    return {"user": db_user, "access_token": token, "token_type": "bearer"}


@router.post("/login")
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    """Authenticate a user and return an access token."""
    email = login_data.email
    password = login_data.password

    # Fetch user from DB
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        app_logger.info(f"Login failed - user not found: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password against hashed password in DB
    if not auth_handler.verify_password(password, user.password_hash):
        app_logger.info(f"Password verification failed for user: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    token = auth_handler.create_access_token(data={"sub": str(user.id)})

    app_logger.info("User logged in", user_id=user.id, email=user.email)
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}


@router.post("/logout")
def logout():
    """Logout the current user."""
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
def get_current_user(current_user: User = Depends(auth_handler.get_current_user)):
    """Get the current authenticated user."""
    return current_user
