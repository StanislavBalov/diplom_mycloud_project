from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('users/', views.UsersListView.as_view()),
    path('users/<int:user_id>/', views.UserDeleteView.as_view()),
]
