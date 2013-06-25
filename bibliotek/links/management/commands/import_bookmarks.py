import datetime
from django.core.management.base import BaseCommand, CommandError
from bibliotek.links.models import Link
from bs4 import BeautifulSoup


class Command(BaseCommand):
    args = '<bookmark_file>'
    help = 'Import a bookmarks file'

    def handle(self, *args, **options):
        file_path = args[0]
        file = open(file_path, 'rb')
        self.stdout.write('=> Importing %s...' % file_path.split('/')[-1])
        soup = BeautifulSoup(file.read())

        for td in soup.find_all('dt'):
            self.stdout.write(td.a.get('href'))
            link = Link()
            link.title = td.a.text
            link.url = td.a.get('href')
            link.added = datetime.datetime.fromtimestamp(int(td.a.get('add_date')))
            link.tags = td.a.get('tags').replace(',', ' ')
            link.save()

        self.stdout.write('Successfully closed poll')
