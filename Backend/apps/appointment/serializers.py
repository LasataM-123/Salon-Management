from rest_framework import serializers
from apps.appointment.models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(
        source="service.name",
        read_only=True,
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["id", "status"]

    def validate_customer_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Customer name cannot be empty.")
        return value

    def validate_customer_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError("Customer phone cannot be empty.")
        return value

    def validate(self, attrs):
        service = attrs.get("service", getattr(self.instance, "service", None))
        appointment_date = attrs.get("date", getattr(self.instance, "date", None))
        appointment_time = attrs.get("time", getattr(self.instance, "time", None))

        if service and appointment_date and appointment_time:
            conflict = Appointment.objects.filter(
                service=service,
                date=appointment_date,
                time=appointment_time,
            )

            if hasattr(Appointment, "STATUS_CANCELLED"):
                conflict = conflict.exclude(status=Appointment.STATUS_CANCELLED)

            if self.instance:
                conflict = conflict.exclude(pk=self.instance.pk)

            if conflict.exists():
                raise serializers.ValidationError(
                    "This service is already booked for this date and time."
                )

        return attrs