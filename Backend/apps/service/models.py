from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.
class Service(models.Model):
    name = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    duration = models.PositiveIntegerField(validators=[MinValueValidator(1)], help_text="Duration in minutes")

    class Meta:
        ordering = ["name"]
        db_table = 'service'



