from django.core.validators import RegexValidator
from django.db import models


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "especialidades"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Medico(models.Model):
    nombres = models.CharField(max_length=150)
    cmp = models.CharField("CMP", max_length=10, unique=True)  # número de colegiatura
    # PROTECT: no se puede borrar una especialidad que aún tiene médicos
    especialidad = models.ForeignKey(Especialidad, on_delete=models.PROTECT, related_name="medicos")
    telefono = models.CharField(max_length=15)
    correo = models.EmailField()

    class Meta:
        verbose_name = "médico"
        ordering = ["nombres"]

    def __str__(self):
        return f"{self.nombres} (CMP {self.cmp})"


class Paciente(models.Model):
    dni = models.CharField(
        "DNI", max_length=8, unique=True,
        validators=[RegexValidator(r"^\d{8}$", "El DNI debe tener exactamente 8 dígitos.")],
    )
    nombres = models.CharField(max_length=150)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=15)
    correo = models.EmailField()

    class Meta:
        ordering = ["nombres"]

    def __str__(self):
        return f"{self.nombres} (DNI {self.dni})"


class EstadoCita(models.Model):
    nombre = models.CharField(max_length=20, unique=True)
    es_final = models.BooleanField(default=False)

    class Meta:
        verbose_name = "estado de cita"
        verbose_name_plural = "estados de cita"

    def __str__(self):
        return self.nombre


class Cita(models.Model):
    # PROTECT: una cita es historial; no se borra al borrar al paciente, al médico o al estado
    paciente = models.ForeignKey(Paciente, on_delete=models.PROTECT, related_name="citas")
    medico = models.ForeignKey(Medico, on_delete=models.PROTECT, related_name="citas")
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.CharField(max_length=255)
    estado = models.ForeignKey(EstadoCita, on_delete=models.PROTECT, related_name="citas")

    class Meta:
        ordering = ["fecha", "hora"]
        constraints = [
            models.UniqueConstraint(fields=["medico", "fecha", "hora"], name="cita_unica_medico_fecha_hora"),
        ]

    def __str__(self):
        return f"{self.paciente.nombres} - {self.fecha} {self.hora:%H:%M} con {self.medico.nombres}"


class HistoriaClinica(models.Model):
    # CASCADE: la historia es parte del paciente; si el paciente se borra, su historia también
    paciente = models.OneToOneField(Paciente, on_delete=models.CASCADE, related_name="historia_clinica")
    grupo_sanguineo = models.CharField(max_length=5)
    alergias = models.TextField(blank=True)
    antecedentes = models.TextField(blank=True)

    class Meta:
        verbose_name = "historia clínica"
        verbose_name_plural = "historias clínicas"

    def __str__(self):
        return f"Historia clínica de {self.paciente.nombres}"
