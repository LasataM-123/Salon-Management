from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.response import Response

from apps.appointment.models import Appointment


class DashboardViewSet(viewsets.ViewSet):
    def list(self, request):
        appointments = Appointment.objects.select_related("service")

        total_appointments = appointments.count()

        pending_appointments = appointments.filter(
            status=Appointment.STATUS_PENDING
        ).count()

        confirmed_appointments = appointments.filter(
            status=Appointment.STATUS_CONFIRMED
        ).count()

        completed_appointments = appointments.filter(
            status=Appointment.STATUS_COMPLETED
        ).count()

        cancelled_appointments = appointments.filter(
            status=Appointment.STATUS_CANCELLED
        ).count()

        revenue = appointments.filter(
            status=Appointment.STATUS_COMPLETED
        ).aggregate(
            total=Sum("service__price")
        )["total"] or 0

        return Response(
            {
                "total_appointments": total_appointments,
                "pending_appointments": pending_appointments,
                "confirmed_appointments": confirmed_appointments,
                "completed_appointments": completed_appointments,
                "cancelled_appointments": cancelled_appointments,
                "revenue": revenue,
            }
        )