import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper, 
  Grid, 
  IconButton, 
  Divider, 
  Card, 
  CardContent, 
  CardActions,
  AppBar,
  Toolbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  AttachFile as AttachFileIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8081/api/prof';

// Custom fetch function that includes JWT token from localStorage
const authorizedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`
  };
  
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };
  
  const newOptions = {
    ...options,
    headers
  };
  
  const response = await fetch(url, newOptions);
  
  if (response.status === 401) {
    toast.error('Session expirée, veuillez vous reconnecter');
    localStorage.clear();
    window.location.reload();
  }
  
  return response;
};

const ExerciseManagement = ({ onLogout, userName }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exerciseForm, setExerciseForm] = useState({
    titre: '',
    description: '',
    dateLimite: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [fileUrlDialogOpen, setFileUrlDialogOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchExercisesByClassId(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/annonces/professeur/classes`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Impossible de récupérer les classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercisesByClassId = async (classId) => {
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices/classe/${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Impossible de récupérer les exercices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseForm({
      ...exerciseForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.warning('Veuillez sélectionner une classe');
      return;
    }
    try {
      setLoading(true);
      const response = await authorizedFetch(`${API_BASE_URL}/exercices?classeId=${selectedClassId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseForm)
      });
      if (!response.ok) {
        throw new Error('Failed to create exercise');
      }
      const newExercise = await response.json();
      if (selectedFiles.length > 0) {
        await uploadFiles(newExercise.id);
      }
      fetchExercisesByClassId(selectedClassId);
      setExerciseForm({
        titre: '',
        description: '',
        dateLimite: '',
      });
      setSelectedFiles([]);
      toast.success('Exercice créé avec succès');
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error('Erreur lors de la création de l\'exercice');
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (exerciseId) => {
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await authorizedFetch(
          `${API_BASE_URL}/exercices/${exerciseId}/fichiers`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload file ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        toast.error(`Erreur lors du téléchargement du fichier ${file.name}`);
      }
    }
  };

  const handleAddFilesToExercise = async (e, exerciseId) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      toast.warning('Veuillez sélectionner des fichiers');
      return;
    }
    try {
      setLoading(true);
      await uploadFiles(exerciseId);
      fetchExercisesByClassId(selectedClassId);
      setSelectedFiles([]);
      setSelectedExercise(null);
      toast.success('Fichiers ajoutés avec succès');
    } catch (error) {
      console.error('Error adding files:', error);
      toast.error('Erreur lors de l\'ajout des fichiers');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (fileId) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setFileToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      setLoading(true);
      const response = await authorizedFetch(
        `${API_BASE_URL}/exercices/fichiers/${fileToDelete}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      fetchExercisesByClassId(selectedClassId);
      toast.success('Fichier supprimé avec succès');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Erreur lors de la suppression du fichier');
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  const handleFileClick = (file) => {
    setSelectedFileUrl(file.url);
    setFileUrlDialogOpen(true);
  };

  const closeFileUrlDialog = () => {
    setSelectedFileUrl('');
    setFileUrlDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestion des Exercices
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Bonjour, {userName}
            </Typography>
            <Button 
              color="inherit" 
              onClick={onLogout}
              startIcon={<LogoutIcon />}
            >
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Sélectionner une classe
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Classe</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClassId}
              label="Classe"
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Sélectionner une classe</em>
              </MenuItem>
              {classes.map((classe) => (
                <MenuItem key={classe.id} value={classe.id}>
                  {classe.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {selectedClassId && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Créer un nouvel exercice
            </Typography>
            <Box component="form" onSubmit={handleCreateExercise} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="titre"
                    label="Titre de l'exercice"
                    name="titre"
                    value={exerciseForm.titre}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={exerciseForm.description}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="dateLimite"
                    label="Date limite"
                    name="dateLimite"
                    type="datetime-local"
                    value={exerciseForm.dateLimite}
                    onChange={handleInputChange}
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    disabled={loading}
                  >
                    Ajouter des fichiers
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      hidden
                    />
                  </Button>
                  {selectedFiles.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {selectedFiles.length} fichier(s) sélectionné(s)
                    </Typography>
                  )}
                </Grid>
                {selectedFiles.length > 0 && (
                  <Grid item xs={12}>
                    <List dense>
                      {selectedFiles.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={file.name} 
                            secondary={formatFileSize(file.size)} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                  >
                    {loading ? 'Création en cours...' : 'Créer l\'exercice'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
</Container>
        {selectedClassId && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Liste des exercices
            </Typography>
            {loading && exercises.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : exercises.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  Aucun exercice disponible pour cette classe
                </Typography>
              </Paper>
            ) : (
              exercises.map((exercise) => (
                <Card key={exercise.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {exercise.titre}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Publié le {formatDate(exercise.datePub)} • Date limite: {formatDate(exercise.dateLimite)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {exercise.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                      Fichiers joints
                    </Typography>
                    {exercise.fichiers.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Aucun fichier joint
                      </Typography>
                    ) : (
                      <List dense>
                        {exercise.fichiers.map((file) => (
                          <ListItem 
                            key={file.id}
                            button
                            onClick={() => handleFileClick(file)}
                          >
                            <ListItemText 
                              primary={file.nom} 
                              secondary={formatFileSize(file.taille)} 
                            />
                            <ListItemSecondaryAction>
                              <Tooltip title="Supprimer le fichier">
                                <IconButton 
                                  edge="end" 
                                  aria-label="delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteDialog(file.id);
                                  }}
                                  disabled={loading}
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                  <CardActions>
                    {selectedExercise === exercise.id ? (
                      <Accordion sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Ajouter des fichiers</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box component="form" onSubmit={(e) => handleAddFilesToExercise(e, exercise.id)}>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<AttachFileIcon />}
                              disabled={loading}
                              sx={{ mb: 2 }}
                            >
                              Sélectionner des fichiers
                              <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                hidden
                              />
                            </Button>
                            {selectedFiles.length > 0 && (
                              <List dense>
                                {selectedFiles.map((file, index) => (
                                  <ListItem key={index}>
                                    <ListItemText 
                                      primary={file.name} 
                                      secondary={formatFileSize(file.size)} 
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                              <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={loading || selectedFiles.length === 0}
                              >
                                {loading ? <CircularProgress size={24} /> : 'Ajouter'}
                              </Button>
                              <Button 
                                variant="outlined" 
                                onClick={() => {
                                  setSelectedExercise(null);
                                  setSelectedFiles([]);
                                }}
                                disabled={loading}
                              >
                                Annuler
                              </Button>
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      <Button 
                        startIcon={<AttachFileIcon />}
                        onClick={() => setSelectedExercise(exercise.id)}
                        disabled={loading}
                      >
                        Ajouter des fichiers
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))
            )}
          </Box>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
        >
          <DialogTitle>Confirmation de suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleDeleteFile} 
              color="error" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={fileUrlDialogOpen}
          onClose={closeFileUrlDialog}
        >
          <DialogTitle>Fichier sélectionné</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cliquez sur le lien pour accéder au fichier :
            </DialogContentText>
            <Link 
              href={selectedFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ wordBreak: 'break-all' }}
            >
              {selectedFileUrl}
            </Link>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeFileUrlDialog} disabled={loading}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
};

export default ExerciseManagement;