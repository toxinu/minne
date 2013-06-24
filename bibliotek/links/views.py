import json

from bibliotek.links.models import Link
from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.core.paginator import PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from bibliotek.links.serializers import LinkSerializer
from bibliotek.links.serializers import PaginatedLinkSerializer
from rest_framework import status
from django.shortcuts import render_to_response
from rest_framework.filters import SearchFilter
from django.http import HttpResponse


class LinkList(APIView):
    def get(self, request, format=None):
        links = Link.objects.order_by('-id')
        paginator = Paginator(links, 30)
        page = request.QUERY_PARAMS.get('page')

        try:
            links = paginator.page(page)
        except PageNotAnInteger:
            links = paginator.page(1)
        except EmptyPage:
            links = paginator.page(paginator.num_pages)

        serializer_context = {'request': request}
        serializer = PaginatedLinkSerializer(links,
                                             context=serializer_context)

        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LinkSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LinkDetail(APIView):
    def get_object(self, pk):
        try:
            return Link.objects.get(pk=pk)
        except Link.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        link = self.get_object(pk)
        serializer = LinkSerializer(link)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        link = self.get_object(pk)
        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk, format=None):
        link = self.get_object(pk)
        serializer = LinkSerializer(link, data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def links_search(request):
    objects = Link.objects.all()
    res = []
    for r in objects:
        link = {
            "id": r.id,
            "title": r.title,
            "url": r.url,
            "tags": r.tags,
            "added": r.added.strftime('%y/%m/%d')}
        res.append(link)
    return HttpResponse(json.dumps(res), content_type="application/json")
