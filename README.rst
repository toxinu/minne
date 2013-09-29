Minne
=====

I'm Minne, your personnal (or not )links shelf which support Persona authentification!

.. image:: https://raw.github.com/socketubs/minne/master/screenshots/screenshot_01.png

Installation
------------

This is the right way, with ``virtualenv``:

::

  cd /var/www
  git clone https://github.com/socketubs/minne.git
  cd minne
  virtualenv virtenv
  source virtenv/bin/activate
  pip install -r requirements.txt
  cp minne/local_settings_example.py minne/local_settings.py
  # Change BROWSERID_CREATE_USER option if your want minne for personnal usage
  python manage.py syncdb
  python manage.py migrate
  python manage.py runserver

Open your browser at ``http://localhost:8000/``.


Update
------

This is how to update your Minne: ::

  cd /var/www/minne
  source virtenv/bin/activate
  git pull
  pip install -r requirements.txt -U

Nginx
-----

For people which want to use it with a https reverse proxy (like Nginx).

In you settings.py: ::

  SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')

In your nginx conf: ::

  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Protocol https; # Tell django we're using https
  }


License
-------

License is `AGPL3`_. See `LICENSE`_.

.. _AGPL3: http://www.gnu.org/licenses/agpl.html
.. _LICENSE: https://raw.github.com/socketubs/minne/master/LICENSE
