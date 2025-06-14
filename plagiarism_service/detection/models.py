from django.db import models

class Soumission(models.Model):
    nom_fichier = models.CharField(max_length=255)
    texte = models.TextField()
    date_soumission = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom_fichier
