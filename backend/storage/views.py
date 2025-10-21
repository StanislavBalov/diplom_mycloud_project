from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import StoredFile as File  
from .serializers import FileSerializer
from django.core.exceptions import ValidationError

MAX_FILE_SIZE_MB = 50  
ALLOWED_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
]

def validate_file_obj(f):
    if f is None:
        raise ValidationError("No file provided")
    if f.size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationError(f"File too large (max {MAX_FILE_SIZE_MB} MB)")
    if hasattr(f, "content_type") and f.content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError(f"Unsupported file type: {getattr(f, 'content_type', 'unknown')}")

class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")
        try:
            validate_file_obj(file_obj)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        f = File(owner=request.user, file=file_obj, name=getattr(file_obj, 'name', 'uploaded'))
        f.save()
        return Response(FileSerializer(f).data, status=status.HTTP_201_CREATED)


class UserFilesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        files = File.objects.filter(owner=request.user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserFilesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        if not request.user.is_administrator:
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        files = File.objects.filter(owner_id=user_id)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)