import os
import re
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

class MainPage(webapp.RequestHandler):
    def get(self):

        p = self.request.get('p');

        if re.match("^[A-Za-z0-9_-]*$", p):
            if p:
                page = p + ".html"
            else:
                page = "main.html"

            if not os.path.exists(page):
                page = "404.html"

            if p == "index":
                page = "404.html"

        else:
            page = "404.html"

        template_values = {
            "page" : page
        }

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))

application = webapp.WSGIApplication([('/', MainPage)],debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
