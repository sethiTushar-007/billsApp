from django.urls import path, include
from . views import *

urlpatterns = [
    path('password-update/', UpdatePasswordView.as_view()),
    path('import-data/', ImportDataView.as_view()),
    path('send-email-confirmation/', EmailConfirmationView.as_view()),
    path('verify-email/', CheckEmailConfirmationView.as_view()),
    path('send-password-reset-email/', PasswordResetEmailView.as_view()),
    path('reset-password-check/', PasswordResetCheckView.as_view()),
    path('userinfo-create/', UserInfoCreateView.as_view()),
    path('userinfo-get/', UserInfoGetView.as_view()),
    path('userinfo-update/<int:pk>', UserInfoUpdateView.as_view()),
    path('user-delete/', UserDelete.as_view()),
    path('item-create/', ItemCreateView.as_view()),
    path('item-get/', ItemGetView.as_view()),
    path('item-get-withpage/', ItemGetPageView.as_view()),
    path('item-update/<int:pk>', ItemUpdateView.as_view()),
    path('items-delete/', ItemDeleteView.as_view()),
    path('bill-create/', BillCreateView.as_view()),
    path('bill-get/', BillGetView.as_view()),
    path('bill-get-withpage/', BillGetPageView.as_view()),
    path('bill-update/<int:pk>', BillUpdateView.as_view()),
    path('bill-delete/', BillDeleteView.as_view()),
    path('customer-create/', CustomerCreateView.as_view()),
    path('customer-get/', CustomerGetView.as_view()),
    path('customer-get-withpage/', CustomerGetPageView.as_view()),
    path('customer-update/<int:pk>', CustomerUpdateView.as_view()),
    path('customers-delete/', CustomerDeleteView.as_view()),
    path('mail-bill/', EmailFileSend.as_view()),
    path('mail-without-bill/', EmailSend.as_view()),
    path('document-upload/', DocumentUploadView.as_view()),
    path('document-delete/', DocumentDeleteView.as_view()),
    path('document-save/', DocumentSaveView.as_view()),
    path('document-download/', DocumentDownloadView.as_view()),
    path('export-data/', ExportDataView.as_view()),
]