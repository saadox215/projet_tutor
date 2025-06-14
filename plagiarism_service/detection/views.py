import fitz
import logging
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from tempfile import NamedTemporaryFile
from .models import Soumission

logger = logging.getLogger(__name__)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def detect_plagiarism(request):
    logger.info("📥 Nouvelle requête reçue à /api/plagiat/")
    logger.info(f"Content-Type: {request.content_type}")
    logger.info(f"Headers: {dict(request.headers)}")
    logger.info(f"FILES: {request.FILES}")
    logger.info(f"DATA: {request.data}")

    fichier = request.FILES.get("fichier")
    if not fichier:
        logger.warning("❌ Aucun fichier reçu.")
        return Response({"error": "Aucun fichier envoyé"}, status=400)

    try:
        # Gérer les fichiers en mémoire
        if isinstance(fichier, InMemoryUploadedFile):
            logger.info(f"📎 Fichier en mémoire : {fichier.name}, {fichier.size} octets, type: {fichier.content_type}")
            temp_file = NamedTemporaryFile(delete=False)
            for chunk in fichier.chunks():
                temp_file.write(chunk)
            temp_file.flush()
            temp_file.seek(0)
            doc = fitz.open(stream=temp_file.read(), filetype="pdf")
            temp_file.close()

        # Gérer les fichiers temporaires (upload > 2.5MB)
        elif isinstance(fichier, TemporaryUploadedFile):
            logger.info(f"📎 Fichier temporaire : {fichier.name}, chemin: {fichier.temporary_file_path()}")
            doc = fitz.open(fichier.temporary_file_path())

        else:
            logger.error(f"❗ Format de fichier non reconnu : {type(fichier)}")
            return Response({"error": "Format de fichier non pris en charge"}, status=400)

        # Extraction du texte
        contenu = ""
        for page in doc:
            contenu += page.get_text()
        doc.close()

        logger.debug(f"📝 Texte extrait (100 premiers caractères) : {contenu[:100]}")

    except Exception as e:
        logger.exception("Erreur lors de la lecture du fichier PDF.")
        return Response({"error": f"Erreur lecture PDF : {str(e)}"}, status=500)

    # Vérification du plagiat
    anciennes = Soumission.objects.all()
    anciens_textes = [s.texte for s in anciennes]

    if anciens_textes:
        vecteurs = TfidfVectorizer().fit_transform(anciens_textes + [contenu])
        scores = cosine_similarity(vecteurs[-1], vecteurs[:-1])[0]
        max_score = max(scores)
        index_max = scores.tolist().index(max_score)
        fichier_similaire = anciennes[index_max].nom_fichier
        logger.info(f"📊 Score de similarité max : {max_score:.4f} avec le fichier : {fichier_similaire}")
    else:
        max_score = 0.0
        fichier_similaire = None
        logger.info("📁 Aucune soumission précédente. Aucun score de similarité calculé.")

    # Sauvegarde
    Soumission.objects.create(nom_fichier=fichier.name, texte=contenu)

    return Response({
        "score": round(float(max_score), 4),
        "avec": fichier_similaire,
        "texte_similaire": contenu
    })
