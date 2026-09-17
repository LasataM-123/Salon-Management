from rest_framework.routers import DefaultRouter
from apps.dashboard.views import DashboardViewSet

router = DefaultRouter()
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = router.urls