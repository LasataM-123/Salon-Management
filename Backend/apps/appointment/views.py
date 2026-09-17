from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.appointment.models import Appointment
from apps.appointment.serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("service").all()
    serializer_class = AppointmentSerializer

    @action(detail=True, methods=["patch"])
    def status(self, request, pk=None):
        appointment = self.get_object()

        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"detail": "Status is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_status not in dict(Appointment.STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_statuses = Appointment.ALLOWED_TRANSITIONS[
            appointment.status
        ]

        if new_status not in allowed_statuses:
            return Response(
                {
                    "detail": (
                        f"Cannot change status from "
                        f"{appointment.status} to {new_status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        appointment.status = new_status
        appointment.save(update_fields=["status"])

        return Response(
            AppointmentSerializer(appointment).data,
            status=status.HTTP_200_OK,
        )