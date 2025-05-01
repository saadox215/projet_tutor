import React, { useState, useEffect } from 'react';

const Fichier = () => {
  const [classeId, setClasseId] = useState(1); // ID de la classe
  const [professeurId, setProfesseurId] = useState(1); // ID du professeur
  const [exerciceNom, setExerciceNom] = useState('');
  const [exercices, setExercices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [exerciceId, setExerciceId] = useState(null);
  const token = localStorage.getItem('token');
  // Récupérer tous les exercices d'une classe
  useEffect(() => {
    fetch(`http://localhost:8081/api/prof/exercices/classe/${classeId}`,{method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      .then(res => res.json())
      .then(data => setExercices(data))
      .catch(err => console.error('Erreur fetch exercices :', err));
  }, [classeId]);

  const handleCreateExercice = () => {
    const exercice = { nom: exerciceNom }; // Ton DTO peut contenir d'autres champs

    fetch(`http://localhost:8081/api/prof/exercices?professeurId=${professeurId}&classeId=${classeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercice),
    })
      .then(res => res.json())
      .then(data => {
        alert('Exercice créé');
        setExerciceId(data.id);
        setExercices([...exercices, data]);
      })
      .catch(err => console.error('Erreur création exercice :', err));
  };

  const handleFileUpload = () => {
    if (!selectedFile || !exerciceId) {
      alert("Veuillez sélectionner un fichier et un exercice.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:8081/api/prof/exercices/${exerciceId}/fichiers?professeurId=${professeurId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert('Fichier uploadé : ' + data.nom);
      })
      .catch(err => console.error('Erreur upload fichier :', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion des Exercices</h1>

      <div>
        <input
          type="text"
          placeholder="Nom de l'exercice"
          value={exerciceNom}
          onChange={e => setExerciceNom(e.target.value)}
        />
        <button onClick={handleCreateExercice}>Créer Exercice</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Uploader un fichier</h2>
        <select onChange={e => setExerciceId(e.target.value)} value={exerciceId || ''}>
          <option value="">-- Sélectionner un exercice --</option>
          {exercices.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.titre}</option>
          ))}
        </select>

        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Uploader</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Liste des Exercices</h2>
        <ul>
          {exercices.map(ex => (
            <li key={ex.id}>
              {ex.nom} (ID: {ex.id})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Fichier;
