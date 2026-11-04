from datetime import date

from django.db.models import ProtectedError
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Cita, Especialidad, EstadoCita, Medico, Paciente
from .serializers import (
    CitaSerializer, EspecialidadSerializer, EstadoCitaSerializer, MedicoSerializer, PacienteSerializer,
)


class BorradoProtegidoMixin:
    """Si el registro tiene datos relacionados (on_delete=PROTECT), responde 409 en vez de un error 500."""

    mensaje_protegido = "No se puede eliminar: el registro tiene datos relacionados."

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({"detail": self.mensaje_protegido}, status=status.HTTP_409_CONFLICT)


class EspecialidadViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    mensaje_protegido = "No se puede eliminar: la especialidad tiene médicos registrados."


class MedicoViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    serializer_class = MedicoSerializer
    mensaje_protegido = "No se puede eliminar: el médico tiene citas registradas."

    def get_queryset(self):
        medicos = Medico.objects.select_related("especialidad")
        especialidad = self.request.query_params.get("especialidad")  # ?especialidad=<id>
        if especialidad:
            if not especialidad.isdigit():
                raise ValidationError({"especialidad": "Debe ser el id numérico de una especialidad."})
            medicos = medicos.filter(especialidad_id=especialidad)
        return medicos


class PacienteViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    mensaje_protegido = "No se puede eliminar: el paciente tiene citas registradas."


class CitaViewSet(viewsets.ModelViewSet):
    serializer_class = CitaSerializer

    def get_queryset(self):
        citas = Cita.objects.select_related("paciente", "medico__especialidad", "estado")
        fecha = self.request.query_params.get("fecha")  # ?fecha=<aaaa-mm-dd>
        if fecha:
            try:
                citas = citas.filter(fecha=date.fromisoformat(fecha))
            except ValueError:
                raise ValidationError({"fecha": "Use el formato aaaa-mm-dd."})
        return citas


class EstadoCitaViewSet(viewsets.ReadOnlyModelViewSet):
    """Catálogo de estados (solo lectura): el frontend toma de aquí los ids y cuáles son finales."""

    queryset = EstadoCita.objects.order_by("id")
    serializer_class = EstadoCitaSerializer
