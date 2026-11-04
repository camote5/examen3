from django.utils import timezone
from rest_framework import serializers

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = "__all__"


class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = "__all__"


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = "__all__"


class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = "__all__"


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriaClinica
        fields = "__all__"


class CitaSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para que el frontend muestre nombres y no solo ids
    paciente_nombre = serializers.CharField(source="paciente.nombres", read_only=True)
    medico_nombre = serializers.CharField(source="medico.nombres", read_only=True)
    especialidad = serializers.CharField(source="medico.especialidad.nombre", read_only=True)
    estado_nombre = serializers.CharField(source="estado.nombre", read_only=True)

    class Meta:
        model = Cita
        fields = "__all__"
        extra_kwargs = {"estado": {"required": False}}  # si no llega, la cita queda "pendiente"
        # Se quita el validador automático del UniqueConstraint (mensaje genérico);
        # el horario ocupado se revisa en validate() con un mensaje propio.
        validators = []

    def validate(self, attrs):
        cita = self.instance  # None al crear; la cita existente en un PATCH
        # En un PATCH parcial, lo que no llega se toma de la cita guardada
        medico = attrs.get("medico", getattr(cita, "medico", None))
        fecha = attrs.get("fecha", getattr(cita, "fecha", None))
        hora = attrs.get("hora", getattr(cita, "hora", None))

        # Solo se revisa la fecha si es nueva: se puede marcar como atendida una cita de ayer
        fecha_cambia = cita is None or fecha != cita.fecha
        if fecha_cambia and fecha < timezone.localdate():
            raise serializers.ValidationError({"fecha": "La fecha de la cita no puede ser anterior a hoy."})

        ocupadas = Cita.objects.filter(medico=medico, fecha=fecha, hora=hora)
        if cita is not None:
            ocupadas = ocupadas.exclude(pk=cita.pk)  # la cita no choca consigo misma
        if ocupadas.exists():
            raise serializers.ValidationError({"hora": "El médico ya tiene una cita registrada en esa fecha y hora."})

        if cita is None and attrs.get("estado") is None:
            attrs["estado"] = EstadoCita.objects.get(nombre="pendiente")
        return attrs
