from rest_framework import serializers
from .models import StoredFile as File

class FileSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    size = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ('id', 'name', 'file', 'owner', 'owner_username', 'size', 'created_at')

    def get_size(self, obj):
        try:
            return obj.file.size
        except:
            return None