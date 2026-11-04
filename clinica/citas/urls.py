from rest_framework.routers import DefaultRouter

from .views import CitaViewSet, EspecialidadViewSet, EstadoCitaViewSet, MedicoViewSet, PacienteViewSet

router = DefaultRouter()
router.register("especialidades", EspecialidadViewSet)
router.register("medicos", MedicoViewSet, basename="medico")
router.register("pacientes", PacienteViewSet)
router.register("citas", CitaViewSet, basename="cita")
router.register("estados", EstadoCitaViewSet)

urlpatterns = router.urls
