import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Sidebar from '../Components/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

// Styled avatar for table
const AvatarCircle = styled('div')(({ bgcolor }) => ({
  width: 45,
  height: 45,
  borderRadius: '50%',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 18,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  marginRight: 12,
  background: bgcolor,
}));

const NoDataBox = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fafbfc',
  borderRadius: 18,
  padding: '60px 0',
  marginTop: 24,
  minHeight: 180,
  border: '1.5px dashed #f1f2f6',
});

const statusColors = [
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#9C27B0',
  '#E91E63',
  '#00BCD4',
  '#FF5722',
  '#673AB7',
  '#03A9F4',
  '#8BC34A',
];

const getAvatar = (firstName, lastName) => {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  return '?';
};

const ToggleButton = styled(Box)(({ open }) => ({
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px',
  cursor: 'pointer',
  display: open ? 'none' : 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  width: 'fit-content',
  '&:hover': {
    background: '#f5f5f5',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const EmployeesListComponent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch employees data
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const resp = await fetch('http://localhost:8000/portal-users');
      const data = await resp.json();
      if (data.users && Array.isArray(data.users)) {
        setEmployees(data.users);
      } else if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setFetchError('No users found');
        setEmployees([]);
      }
    } catch (err) {
      setFetchError('Could not load employees data');
      setEmployees([]);
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const processedEmployees = employees.map((emp, i) => ({
    ...emp,
    id: emp.UserID || emp.UserId || i,
    name: `${emp.FirstName || ''} ${emp.LastName || ''}`.trim() || 'Unknown',
    email: emp.Email || emp.email || 'N/A',
    phone: emp.MobileNumber || emp.PhoneNumber || emp.phone || 'N/A',
    role: emp.Role || emp.role || 'USER',
    avatar: getAvatar(emp.FirstName || '', emp.LastName || ''),
    bgColor: statusColors[i % statusColors.length],
  }));

  const handleEdit = (employeeId) => {
    const employee = employees.find(
      (emp) => emp.UserID === employeeId || emp.UserId === employeeId,
    );
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        FirstName: employee.FirstName || '',
        LastName: employee.LastName || '',
        Email: employee.Email || '',
        MobileNumber: employee.MobileNumber || '',
        Role: employee.Role || 'USER',
        MaritalStatus: employee.MaritalStatus || 'SINGLE',
        DateOfBirth: employee.DateOfBirth || '',
        UserName: employee.UserName || '',
        TwoFactorAuthentication: employee.TwoFactorAuthentication || false,
      });
      setUpdateMessage('');
      setEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
    setFormData({});
    setUpdateMessage('');
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!selectedEmployee) return;

    setUpdating(true);
    try {
      const userId = selectedEmployee.UserID || selectedEmployee.UserId;
      const updateData = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        MobileNumber: formData.MobileNumber,
        MaritalStatus: formData.MaritalStatus,
        DateOfBirth: formData.DateOfBirth,
      };

      const response = await fetch(
        `http://localhost:8000/portal-users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );

      const result = await response.json();

      if (result.success) {
        setUpdateMessage('User updated successfully!');
        setUpdateSuccess(true);
        // Refresh employees list
        setTimeout(() => {
          fetchEmployees();
          handleCloseModal();
        }, 1500);
      } else {
        setUpdateMessage(`Error: ${result.error || 'Failed to update user'}`);
        setUpdateSuccess(false);
      }
    } catch (err) {
      setUpdateMessage(`Error: ${err.message}`);
      setUpdateSuccess(false);
      console.error('Update error:', err);
    }
    setUpdating(false);
  };

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      sessionStorage.removeItem('isLoggedIn');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/', { replace: true });
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <Box sx={{ p: 3, background: '#fafbfc', minHeight: '100vh' }}>
        {/* Header with Toggle Button */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <ToggleButton
              open={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </ToggleButton>
            <Typography variant="h4" fontWeight={700}>
              Users
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              disabled={loggingOut}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              }}
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </Stack>
        </Stack>

        {/* Breadcrumb Navigation */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            List
          </Typography>
        </Stack>

        {/* Table Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress />
          </Box>
        ) : fetchError ? (
          <NoDataBox>
            <Typography variant="h6" sx={{ color: '#de4242', fontWeight: 500 }}>
              {fetchError}
            </Typography>
          </NoDataBox>
        ) : processedEmployees.length === 0 ? (
          <NoDataBox>
            <Box sx={{ fontSize: 56, mb: 2, color: '#e0e2e7' }}>👥</Box>
            <Typography
              variant="h6"
              color="#b0bac9"
              fontWeight={500}
              sx={{ fontSize: 21, mt: 1 }}
            >
              No employees found
            </Typography>
          </NoDataBox>
        ) : (
          <Paper elevation={2} sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#666',
                        padding: '16px',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#666',
                        padding: '16px',
                      }}
                    >
                      Phone number
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#666',
                        padding: '16px',
                      }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#666',
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      hover
                      sx={{
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: '#f9f9f9',
                        },
                      }}
                    >
                      <TableCell sx={{ padding: '16px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <AvatarCircle bgcolor={employee.bgColor}>
                            {employee.avatar}
                          </AvatarCircle>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: '#333',
                                fontSize: 14,
                              }}
                            >
                              {employee.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: '#999',
                                fontSize: 12,
                                marginTop: '4px',
                              }}
                            >
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '16px', color: '#333' }}>
                        {employee.phone}
                      </TableCell>
                      <TableCell sx={{ padding: '16px', color: '#333' }}>
                        <Box
                          sx={{
                            display: 'inline-block',
                            background:
                              employee.role === 'ADMIN' ? '#e3f2fd' : '#f5f5f5',
                            color:
                              employee.role === 'ADMIN' ? '#1976d2' : '#666',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          B2B2C {employee.role}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '16px',
                          textAlign: 'center',
                        }}
                      >
                        <IconButton
                          onClick={() => handleEdit(employee.id)}
                          sx={{
                            color: '#1976d2',
                            '&:hover': {
                              background: '#e3f2fd',
                            },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 3,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '28px' }}>
            Edit User
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon sx={{ fontSize: 28, color: '#999' }} />
          </IconButton>
        </Box>

        {updateMessage && (
          <Alert
            severity={updateSuccess ? 'success' : 'error'}
            sx={{ mb: 2 }}
            onClose={() => setUpdateMessage('')}
          >
            {updateMessage}
          </Alert>
        )}

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Row 1: Role and 2FA */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#999', fontSize: '14px' }}>
                  Role
                </InputLabel>
                <Select
                  value={formData.Role || 'USER'}
                  label="Role"
                  disabled
                  sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#999',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ddd',
                    },
                  }}
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#999', fontSize: '14px' }}>
                  2FA Authentication
                </InputLabel>
                <Select
                  value={
                    formData.TwoFactorAuthentication ? 'ENABLE' : 'DISABLE'
                  }
                  label="2FA Authentication"
                  disabled
                  sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#999',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ddd',
                    },
                  }}
                >
                  <MenuItem value="DISABLE">DISABLE</MenuItem>
                  <MenuItem value="ENABLE">ENABLE</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Row 2: First Name and Last Name */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}
            >
              <TextField
                label="First Name"
                value={formData.FirstName || ''}
                onChange={(e) => handleFormChange('FirstName', e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999',
                    fontSize: '14px',
                  },
                }}
              />
              <TextField
                label="Last Name"
                value={formData.LastName || ''}
                onChange={(e) => handleFormChange('LastName', e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#333',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#333',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>

            {/* Row 3: Phone and Email */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}
            >
              <TextField
                label="Phone Number"
                value={formData.MobileNumber || ''}
                onChange={(e) =>
                  handleFormChange('MobileNumber', e.target.value)
                }
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999',
                    fontSize: '14px',
                  },
                }}
              />
              <TextField
                label="Email ID"
                value={formData.Email || ''}
                onChange={(e) => handleFormChange('Email', e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>

            {/* Row 4: Marital Status and Date of Birth */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#999', fontSize: '14px' }}>
                  Marital Status
                </InputLabel>
                <Select
                  value={formData.MaritalStatus || 'SINGLE'}
                  onChange={(e) =>
                    handleFormChange('MaritalStatus', e.target.value)
                  }
                  label="Marital Status"
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ddd',
                    },
                  }}
                >
                  <MenuItem value="SINGLE">SINGLE</MenuItem>
                  <MenuItem value="MARRIED">MARRIED</MenuItem>
                  <MenuItem value="DIVORCED">DIVORCED</MenuItem>
                  <MenuItem value="WIDOWED">WIDOWED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Date of Birth"
                value={formData.DateOfBirth || ''}
                onChange={(e) =>
                  handleFormChange('DateOfBirth', e.target.value)
                }
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#999',
                    fontSize: '14px',
                  },
                }}
              />
            </Box>

            {/* Row 5: Username */}
            <TextField
              label="Username"
              value={formData.UserName || ''}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  color: '#999',
                },
                '& .MuiInputLabel-root': {
                  color: '#999',
                  fontSize: '14px',
                },
              }}
            />

            {/* Update Button */}
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2 }}
            >
              <Button
                variant="contained"
                disabled={updating}
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                  },
                }}
                onClick={handleUpdateUser}
              >
                {updating ? 'Updating...' : 'Update user'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeesListComponent;
