from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls import url
from django.conf.urls.static import static
from API.views import GoogleLogin, FacebookLogin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('API.urls')),
    path('social-login/google/',GoogleLogin.as_view(), name='google_login'),
    path('social-login/facebook/',FacebookLogin.as_view(), name='facebook_login'),
    path('rest-auth/', include('rest_auth.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
