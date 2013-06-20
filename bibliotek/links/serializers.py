# -*- coding: utf-8 -*-
from rest_framework import serializers
from rest_framework import pagination
from bibliotek.links.models import Link


class LinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Link
        fields = ('id', 'url', 'title', 'tags', 'added')


class PaginatedLinkSerializer(pagination.PaginationSerializer):
    class Meta:
        object_serializer_class = LinkSerializer
