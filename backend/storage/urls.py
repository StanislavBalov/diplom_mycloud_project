from django.urls import path
from . import views

urlpatterns = [
    path('files/', views.FilesListView.as_view()),
    path('files/upload/', views.UploadFileView.as_view()),
    path('files/<int:file_id>/download/', views.DownloadFileView.as_view()),
    path('files/<int:file_id>/delete/', views.DeleteFileView.as_view()),
    path('files/<int:file_id>/rename/', views.RenameFileView.as_view()),
    path('files/<int:file_id>/comment/', views.ChangeCommentView.as_view()),
    path('files/<int:file_id>/public/', views.PublicLinkView.as_view()),
    path('public/<uuid:link_uuid>/', views.DownloadPublicView.as_view()),
]
