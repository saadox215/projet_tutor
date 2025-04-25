import { memo, useMemo } from 'react';
import {
  Paper, Box, Typography, Button, TextField, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, TablePagination, Chip,
  Avatar, InputAdornment, Tooltip, Autocomplete, Fade, IconButton // Add IconButton here
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TableRowStyled } from '../theme/theme';


const UserTable = memo(({
  users, searchTerm, selectedRole, page, rowsPerPage, handleEditUser, handleDeleteUser,
  setSearchTerm, setSelectedRole, setPage, setRowsPerPage, handleOpenUserDialog,
  getRoleColor, getRoleIcon,
}) => {
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole ? user.role === selectedRole : true)
    );
  }, [users, searchTerm, selectedRole]);

  const roleOptions = useMemo(() => [
    { label: 'All Roles', value: '' },
    { label: 'Student', value: 'ETUDIANT' },
    { label: 'Professor', value: 'PROFESSEUR' },
    { label: 'Admin', value: 'ADMIN' },
  ], []);

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
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenUserDialog}
              sx={{ bgcolor: 'primary.main', px: 4, py: 1.5 }}
            >
              Add User
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search users by name or email..."
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
            <Autocomplete
              options={roleOptions}
              getOptionLabel={(option) => option.label}
              value={roleOptions.find(opt => opt.value === selectedRole) || roleOptions[0]}
              onChange={(e, newValue) => setSelectedRole(newValue?.value || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Role"
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: '100%', sm: 200 }, bgcolor: 'white' }}
                />
              )}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
              disableClearable
            />
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRowStyled
                      key={user.id}
                      component={motion.tr}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: getRoleColor(user.role),
                              width: 40,
                              height: 40,
                              fontSize: 16,
                            }}
                          >
                            {user.name?.charAt(0)}{user.prenom?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name} {user.prenom}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role}
                          size="small"
                          sx={{
                            bgcolor: `${getRoleColor(user.role)}20`,
                            color: getRoleColor(user.role),
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit" TransitionComponent={Fade}>
                          <IconButton
                            onClick={() => handleEditUser(user)}
                            sx={{ color: 'primary.main', mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" TransitionComponent={Fade}>
                          <IconButton
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRowStyled>
                  ))}
              </AnimatePresence>
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users found matching your criteria
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
          count={filteredUsers.length}
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

export default UserTable;