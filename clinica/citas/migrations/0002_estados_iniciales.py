from django.db import migrations

# Orden fijo: en una base nueva quedan con id 1-4. atendida y cancelada son estados finales.
ESTADOS = [
    ("pendiente", False),
    ("confirmada", False),
    ("atendida", True),
    ("cancelada", True),
]


def crear_estados(apps, schema_editor):
    EstadoCita = apps.get_model("citas", "EstadoCita")
    for nombre, es_final in ESTADOS:
        EstadoCita.objects.get_or_create(nombre=nombre, defaults={"es_final": es_final})


def borrar_estados(apps, schema_editor):
    EstadoCita = apps.get_model("citas", "EstadoCita")
    EstadoCita.objects.filter(nombre__in=[nombre for nombre, _ in ESTADOS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("citas", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(crear_estados, borrar_estados),
    ]
