from datetime import date, time

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models import ProtectedError
from django.test import TestCase

from citas.models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


def crear_datos_base():
    especialidad = Especialidad.objects.create(nombre="Cardiología", descripcion="Corazón")
    medico = Medico.objects.create(
        nombres="Carlos Ruiz", cmp="012345", especialidad=especialidad,
        telefono="987654321", correo="cruiz@clinica.pe",
    )
    paciente = Paciente.objects.create(
        dni="12345678", nombres="María López", fecha_nacimiento=date(1990, 5, 10),
        telefono="912345678", correo="maria@correo.pe",
    )
    return especialidad, medico, paciente


class EstadosInicialesTest(TestCase):
    def test_estados_iniciales(self):
        estados = list(EstadoCita.objects.order_by("id").values_list("nombre", "es_final"))
        self.assertEqual(estados, [
            ("pendiente", False), ("confirmada", False), ("atendida", True), ("cancelada", True),
        ])


class PacienteTest(TestCase):
    def test_dni_debe_tener_8_digitos(self):
        for dni in ["1234567", "1234567a"]:
            paciente = Paciente(dni=dni, nombres="Ana", fecha_nacimiento=date(2000, 1, 1),
                                telefono="900000000", correo="ana@correo.pe")
            with self.assertRaises(ValidationError):
                paciente.full_clean()
        Paciente(dni="12345678", nombres="Ana", fecha_nacimiento=date(2000, 1, 1),
                 telefono="900000000", correo="ana@correo.pe").full_clean()


class CitaTest(TestCase):
    def setUp(self):
        self.especialidad, self.medico, self.paciente = crear_datos_base()
        self.pendiente = EstadoCita.objects.get(nombre="pendiente")

    def crear_cita(self):
        return Cita.objects.create(
            paciente=self.paciente, medico=self.medico, fecha=date(2030, 1, 15),
            hora=time(10, 0), motivo="Control", estado=self.pendiente,
        )

    def test_medico_no_repite_fecha_hora(self):
        self.crear_cita()
        with self.assertRaises(IntegrityError):
            self.crear_cita()

    def test_borrar_paciente_con_citas_esta_protegido(self):
        self.crear_cita()
        with self.assertRaises(ProtectedError):
            self.paciente.delete()

    def test_str(self):
        cita = self.crear_cita()
        historia = HistoriaClinica.objects.create(paciente=self.paciente, grupo_sanguineo="O+")
        self.assertEqual(str(self.especialidad), "Cardiología")
        self.assertIn("Carlos Ruiz", str(self.medico))
        self.assertIn("12345678", str(self.paciente))
        self.assertEqual(str(self.pendiente), "pendiente")
        self.assertIn("María López", str(cita))
        self.assertIn("2030-01-15", str(cita))
        self.assertIn("María López", str(historia))
