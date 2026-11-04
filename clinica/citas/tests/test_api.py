from datetime import time, timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from citas.models import Cita, Especialidad, EstadoCita, Medico, Paciente
from citas.tests.test_modelos import crear_datos_base


class ApiTest(APITestCase):
    def setUp(self):
        self.especialidad, self.medico, self.paciente = crear_datos_base()
        self.pendiente = EstadoCita.objects.get(nombre="pendiente")
        self.manana = timezone.localdate() + timedelta(days=1)

    def crear_cita(self, fecha=None, medico=None):
        return Cita.objects.create(
            paciente=self.paciente, medico=medico or self.medico, fecha=fecha or self.manana,
            hora=time(10, 0), motivo="Control", estado=self.pendiente,
        )

    def test_rutas_responden_200(self):
        for ruta in ["/api/especialidades/", "/api/medicos/", "/api/pacientes/", "/api/citas/"]:
            self.assertEqual(self.client.get(ruta).status_code, status.HTTP_200_OK, ruta)

    def test_filtro_medicos_por_especialidad(self):
        pediatria = Especialidad.objects.create(nombre="Pediatría")
        otro = Medico.objects.create(nombres="Rosa Díaz", cmp="054321", especialidad=pediatria,
                                     telefono="900000001", correo="rdiaz@clinica.pe")
        respuesta = self.client.get(f"/api/medicos/?especialidad={pediatria.id}")
        self.assertEqual([m["id"] for m in respuesta.json()], [otro.id])

    def test_filtro_citas_por_fecha(self):
        cita = self.crear_cita()
        self.crear_cita(fecha=self.manana + timedelta(days=1))
        respuesta = self.client.get(f"/api/citas/?fecha={self.manana.isoformat()}")
        self.assertEqual([c["id"] for c in respuesta.json()], [cita.id])

    def test_filtro_invalido_responde_400(self):
        for ruta in ["/api/citas/?fecha=abc", "/api/medicos/?especialidad=abc"]:
            self.assertEqual(self.client.get(ruta).status_code, status.HTTP_400_BAD_REQUEST, ruta)

    def test_post_cita_horario_ocupado_400(self):
        self.crear_cita()
        respuesta = self.client.post("/api/citas/", {
            "paciente": self.paciente.id, "medico": self.medico.id,
            "fecha": self.manana.isoformat(), "hora": "10:00", "motivo": "Control",
        }, format="json")
        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(respuesta.json()["hora"], ["El médico ya tiene una cita registrada en esa fecha y hora."])

    def test_patch_cambia_estado(self):
        cita = self.crear_cita()
        confirmada = EstadoCita.objects.get(nombre="confirmada")
        respuesta = self.client.patch(f"/api/citas/{cita.id}/", {"estado": confirmada.id}, format="json")
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta.json()["estado_nombre"], "confirmada")

    def test_delete_paciente_con_citas_409(self):
        self.crear_cita()
        respuesta = self.client.delete(f"/api/pacientes/{self.paciente.id}/")
        self.assertEqual(respuesta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(respuesta.json()["detail"], "No se puede eliminar: el paciente tiene citas registradas.")
        self.assertTrue(Paciente.objects.filter(id=self.paciente.id).exists())

    def test_delete_especialidad_con_medicos_409(self):
        respuesta = self.client.delete(f"/api/especialidades/{self.especialidad.id}/")
        self.assertEqual(respuesta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(respuesta.json()["detail"], "No se puede eliminar: la especialidad tiene médicos registrados.")

    def test_delete_paciente_sin_citas_204(self):
        respuesta = self.client.delete(f"/api/pacientes/{self.paciente.id}/")
        self.assertEqual(respuesta.status_code, status.HTTP_204_NO_CONTENT)

    def test_cors_permite_localhost_5173(self):
        respuesta = self.client.get("/api/especialidades/", HTTP_ORIGIN="http://localhost:5173")
        self.assertEqual(respuesta["Access-Control-Allow-Origin"], "http://localhost:5173")


class EstadosApiTest(APITestCase):
    def test_estados_lista_4_con_es_final(self):
        respuesta = self.client.get("/api/estados/")
        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        estados = [(e["nombre"], e["es_final"]) for e in respuesta.json()]
        self.assertEqual(estados, [
            ("pendiente", False), ("confirmada", False), ("atendida", True), ("cancelada", True),
        ])
        self.assertIn("id", respuesta.json()[0])

    def test_estados_no_acepta_post(self):
        respuesta = self.client.post("/api/estados/", {"nombre": "otro", "es_final": False}, format="json")
        self.assertEqual(respuesta.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
