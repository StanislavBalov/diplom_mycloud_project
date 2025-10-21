from django.urls import path
from .views import FileUploadView, UserFilesView, AdminUserFilesView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('files/', UserFilesView.as_view(), name='user_files'),
    path('admin/user/<int:user_id>/files/', AdminUserFilesView.as_view(), name='admin_user_files'),
]