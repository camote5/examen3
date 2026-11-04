from django.contrib import admin

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


@admin.register(Especialidad)
class EspecialidadAdmin(admin.ModelAdmin):
    list_display = ["nombre", "descripcion"]


@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ["nombres", "cmp", "especialidad", "telefono", "correo"]
    list_filter = ["especialidad"]


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ["dni", "nombres", "fecha_nacimiento", "telefono", "correo"]
    search_fields = ["dni", "nombres"]


@admin.register(EstadoCita)
class EstadoCitaAdmin(admin.ModelAdmin):
    list_display = ["nombre", "es_final"]


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ["fecha", "hora", "paciente", "medico", "estado"]
    list_filter = ["estado", "fecha"]


@admin.register(HistoriaClinica)
class HistoriaClinicaAdmin(admin.ModelAdmin):
    list_display = ["paciente", "grupo_sanguineo"]
