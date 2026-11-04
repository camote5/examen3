from datetime import time, timedelta

from django.test import TestCase
from django.utils import timezone

from citas.models import Cita, EstadoCita
from citas.serializers import CitaSerializer
from citas.tests.test_modelos import crear_datos_base

MENSAJE_FECHA_PASADA = "La fecha de la cita no puede ser anterior a hoy."
MENSAJE_HORARIO_OCUPADO = "El médico ya tiene una cita registrada en esa fecha y hora."


class CitaSerializerTest(TestCase):
    def setUp(self):
        self.especialidad, self.medico, self.paciente = crear_datos_base()
        self.pendiente = EstadoCita.objects.get(nombre="pendiente")
        self.manana = timezone.localdate() + timedelta(days=1)

    def datos(self, **cambios):
        datos = {
            "paciente": self.paciente.id, "medico": self.medico.id,
            "fecha": self.manana.isoformat(), "hora": "10:00", "motivo": "Control",
        }
        datos.update(cambios)
        return datos

    def crear_cita(self, fecha=None):
        return Cita.objects.create(
            paciente=self.paciente, medico=self.medico, fecha=fecha or self.manana,
            hora=time(10, 0), motivo="Control", estado=self.pendiente,
        )

    def test_rechaza_fecha_pasada(self):
        ayer = timezone.localdate() - timedelta(days=1)
        serializer = CitaSerializer(data=self.datos(fecha=ayer.isoformat()))
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors["fecha"], [MENSAJE_FECHA_PASADA])

    def test_rechaza_horario_ocupado(self):
        self.crear_cita()
        serializer = CitaSerializer(data=self.datos())
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors["hora"], [MENSAJE_HORARIO_OCUPADO])

    def test_estado_por_defecto_pendiente(self):
        serializer = CitaSerializer(data=self.datos())
        self.assertTrue(serializer.is_valid(), serializer.errors)
        cita = serializer.save()
        self.assertEqual(cita.estado.nombre, "pendiente")

    def test_patch_estado_en_cita_pasada(self):
        cita = self.crear_cita(fecha=timezone.localdate() - timedelta(days=1))
        atendida = EstadoCita.objects.get(nombre="atendida")
        serializer = CitaSerializer(cita, data={"estado": atendida.id}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_patch_misma_cita_no_choca(self):
        cita = self.crear_cita()
        serializer = CitaSerializer(cita, data={"motivo": "Chequeo"}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_campos_de_solo_lectura(self):
        data = CitaSerializer(self.crear_cita()).data
        self.assertEqual(data["paciente_nombre"], "María López")
        self.assertEqual(data["medico_nombre"], "Carlos Ruiz")
        self.assertEqual(data["especialidad"], "Cardiología")
        self.assertEqual(data["estado_nombre"], "pendiente")
