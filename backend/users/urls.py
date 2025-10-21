from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UsersListView, UserDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', UsersListView.as_view(), name='users_list'),        
    path('user/<int:user_id>/', UserDeleteView.as_view(), name='user_delete'),
]