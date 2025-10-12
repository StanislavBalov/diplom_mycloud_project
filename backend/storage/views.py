import os, uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import StoredFile
from .serializers import StoredFileSerializer
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class FilesListView(APIView):
    def get(self, request):
        username = request.query_params.get('user')
        if username:
            if not request.user.is_authenticated or not request.user.is_administrator:
                return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
            files = StoredFile.objects.filter(owner__username=username)
        else:
            if not request.user.is_authenticated:
                return Response({'detail':'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
            files = StoredFile.objects.filter(owner=request.user)
        serializer = StoredFileSerializer(files, many=True)
        return Response(serializer.data)

class UploadFileView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail':'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        uploaded = request.FILES.get('file')
        comment = request.data.get('comment', '')
        if uploaded is None:
            return Response({'detail':'No file'}, status=status.HTTP_400_BAD_REQUEST)
        stored_name = f"{uuid.uuid4().hex}_{uploaded.name}"
        user_dir = os.path.join(settings.MEDIA_ROOT, request.user.storage_path)
        os.makedirs(user_dir, exist_ok=True)
        path = os.path.join(user_dir, stored_name)
        with open(path, 'wb+') as dest:
            for chunk in uploaded.chunks():
                dest.write(chunk)
        sf = StoredFile.objects.create(
            owner=request.user,
            original_name=uploaded.name,
            stored_name=stored_name,
            size=uploaded.size,
            comment=comment,
            path=path,
        )
        return Response(StoredFileSerializer(sf).data, status=status.HTTP_201_CREATED)

class DownloadFileView(APIView):
    def get(self, request, file_id):
        sf = get_object_or_404(StoredFile, id=file_id)
        if not request.user.is_authenticated:
            return Response({'detail':'Auth required'}, status=status.HTTP_401_UNAUTHORIZED)
        if sf.owner != request.user and not request.user.is_administrator:
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        if not os.path.exists(sf.path):
            raise Http404
        sf.last_downloaded_at = timezone.now()
        sf.save()
        response = FileResponse(open(sf.path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{sf.original_name}"'
        return response

class DownloadPublicView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, link_uuid):
        sf = get_object_or_404(StoredFile, public_link=link_uuid)
        if not os.path.exists(sf.path):
            raise Http404
        sf.last_downloaded_at = timezone.now()
        sf.save()
        response = FileResponse(open(sf.path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{sf.original_name}"'
        return response

class DeleteFileView(APIView):
    def delete(self, request, file_id):
        sf = get_object_or_404(StoredFile, id=file_id)
        if not request.user.is_authenticated:
            return Response({'detail':'Auth required'}, status=status.HTTP_401_UNAUTHORIZED)
        if sf.owner != request.user and not request.user.is_administrator:
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        try:
            os.remove(sf.path)
        except OSError:
            pass
        sf.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RenameFileView(APIView):
    def post(self, request, file_id):
        new_name = request.data.get('new_name')
        sf = get_object_or_404(StoredFile, id=file_id)
        if not request.user.is_authenticated:
            return Response({'detail':'Auth required'}, status=status.HTTP_401_UNAUTHORIZED)
        if sf.owner != request.user and not request.user.is_administrator:
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        sf.original_name = new_name
        sf.save()
        return Response(StoredFileSerializer(sf).data)

class ChangeCommentView(APIView):
    def post(self, request, file_id):
        comment = request.data.get('comment', '')
        sf = get_object_or_404(StoredFile, id=file_id)
        if not request.user.is_authenticated:
            return Response({'detail':'Auth required'}, status=status.HTTP_401_UNAUTHORIZED)
        if sf.owner != request.user and not request.user.is_administrator:
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        sf.comment = comment
        sf.save()
        return Response(StoredFileSerializer(sf).data)

class PublicLinkView(APIView):
    def get(self, request, file_id):
        sf = get_object_or_404(StoredFile, id=file_id)
        if not request.user.is_authenticated:
            return Response({'detail':'Auth required'}, status=status.HTTP_401_UNAUTHORIZED)
        if sf.owner != request.user and not request.user.is_administrator:
            return Response({'detail':'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'public_link': str(sf.public_link)})
