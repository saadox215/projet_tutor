import { memo, useMemo } from 'react';
import {
  Paper, Box, Typography, Button, TextField, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, TablePagination, Chip, Fade,
  IconButton, InputAdornment, Tooltip
} from '@mui/material';
import { Add, Search, Class, Person, Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TableRowStyled } from '../theme/theme';

const ClassTable = memo(({
  classes, searchTerm, page, rowsPerPage, handleEditClass, handleDeleteClass,
  setSearchTerm, setPage, setRowsPerPage, handleOpenClassDialog, getProfessorName,
}) => {
  const filteredClasses = useMemo(() => {
    return classes.filter(classObj =>
      classObj.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ borderRadius: 16, boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Class Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenClassDialog}
              sx={{ bgcolor: 'primary.main', px: 4, py: 1.5 }}
            >
              Add Class
            </Button>
          </Box>
          <TextField
            placeholder="Search classes..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 }, bgcolor: 'white', borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Professor</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredClasses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((classObj) => (
                    <TableRowStyled
                      key={classObj.id}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{classObj.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'secondary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Class sx={{ color: 'secondary.main' }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {classObj.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Person />}
                          label={getProfessorName(classObj.professorId)}
                          size="small"
                          sx={{ bgcolor: '#e0f2fe', color: 'primary.main', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit" TransitionComponent={Fade}>
                          <IconButton
                            onClick={() => handleEditClass(classObj)}
                            sx={{ color: 'primary.main', mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" TransitionComponent={Fade}>
                          <IconButton
                            onClick={() => handleDeleteClass(classObj.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRowStyled>
                  ))}
              </AnimatePresence>
              {filteredClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No classes found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClasses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ bgcolor: 'background.paper', borderTop: '1px solid #e5e7eb' }}
        />
      </Paper>
    </motion.div>
  );
});

export default ClassTable;