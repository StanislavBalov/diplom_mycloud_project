from rest_framework import serializers
from .models import StoredFile

class StoredFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredFile
        fields = '__all__'
        read_only_fields = ('stored_name','uploaded_at','owner','public_link','path','size')
