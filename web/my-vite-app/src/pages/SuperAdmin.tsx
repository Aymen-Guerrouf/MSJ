import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  People,
  CalendarMonth,
  BarChart,
  Settings,
  Business,
  PersonAdd,
  Edit,
  Delete,
  Notifications,
  ChevronLeft,
  Add,
  LocationOn,
  Phone,
  Email,
  ChevronLeft as ChevronLeftIcon ,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { SuperAdminDashboard , logout  } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

export default function SuperAdmin() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);
  const [openAddMaisonDialog, setOpenAddMaisonDialog] = useState(false);
  const [openAddAdminDialog, setOpenAddAdminDialog] = useState(false);
  const [superData , setSuperData] = useState(null);

  useEffect(()=>{
    const fetchData = async ()=>{
      const data =await SuperAdminDashboard()
      setSuperData(data)
    }
    fetchData()
  },[])


  async function handleLogout(){
    console.log('dddd');
    
    const res = await logout()
    console.log(res);
    
    navigate('/')
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for scrolling to sections
  const dashboardRef = useRef<HTMLDivElement>(null);
  const centresRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

 

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const scrollToSection = (section: string, ref: React.RefObject<HTMLDivElement>) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const userRegistrationData = [
    { month: 'Jan', new: 245, active: 420 },
    { month: 'Fév', new: 268, active: 445 },
    { month: 'Mar', new: 289, active: 465 },
    { month: 'Avr', new: 312, active: 458 },
    { month: 'Mai', new: 298, active: 462 },
    { month: 'Juin', new: 325, active: 468 },
    { month: 'Juil', new: 340, active: 475 },
  ];

  const eventParticipationData = [
    { name: 'Ateliers créatifs', value: 38, color: '#95D6C2' },
    { name: 'Activités sportives', value: 29, color: '#6BC4A6' },
    { name: 'Clubs littéraires', value: 19, color: '#4AB08A' },
    { name: 'Événements culturels', value: 14, color: '#2A9C6E' },
  ];

  const admins = [
    { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@mdj.dz', role: 'Super-Admin', status: 'Actif', lastLogin: '2023-10-26 10:30' },
    { id: 2, name: 'Fatima Zohra', email: 'fatima.zohra@mdj.dz', role: 'Directrice de centre', status: 'Actif', lastLogin: '2023-10-25 15:45' },
    { id: 3, name: 'Mohamed Cherif', email: 'mohamed.cherif@mdj.dz', role: 'Directeur de centre', status: 'Inactif', lastLogin: '2023-10-20 09:00' },
    { id: 4, name: 'Leila Ghozali', email: 'leila.ghozali@mdj.dz', role: 'Directrice de centre', status: 'Suspendu', lastLogin: '2023-10-18 11:15' },
  ];

  const maisonsDeJeunes = [
    { id: 1, name: 'Maison de Jeunes El Hana', wilaya: 'Alger', commune: 'Bab El Oued', address: '12 Rue de la Liberté', phone: '021 45 67 89', director: 'Fatima Zohra', members: 150, status: 'Actif' },
    { id: 2, name: 'Maison de Jeunes Es-Salem', wilaya: 'Oran', commune: 'Oran Centre', address: '25 Avenue de la République', phone: '041 23 45 67', director: 'Mohamed Cherif', members: 120, status: 'Actif' },
    { id: 3, name: 'Maison de Jeunes El Amel', wilaya: 'Constantine', commune: 'Constantine', address: '8 Rue des Martyrs', phone: '031 89 01 23', director: 'Leila Ghozali', members: 95, status: 'Inactif' },
    { id: 4, name: 'Maison de Jeunes El Wifak', wilaya: 'Sétif', commune: 'Sétif', address: '15 Boulevard du 1er Novembre', phone: '036 12 34 56', director: 'Karim Mansouri', members: 110, status: 'Actif' },
  ];

  const wilayas = ['Alger', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Blida', 'Batna', 'Tlemcen', 'Béjaïa', 'Tizi Ouzou'];

  const menuItems = [
    { text: 'Tableau de bord', icon: <Home />, section: 'dashboard', ref: dashboardRef },
    { text: 'Centres Jeunesse', icon: <Business />, section: 'centres', ref: centresRef },
    { text: 'Gestion des Utilisateurs', icon: <People />, section: 'users', ref: usersRef },
    { text: 'Aperçu des Événements', icon: <CalendarMonth />, section: 'events', ref: eventsRef },
    { text: 'Analyses', icon: <BarChart />, section: 'analytics', ref: analyticsRef },
  ];

  const drawer = (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
      <Toolbar
        sx={{
          borderBottom: '1px solid #E0E0E0',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50', fontSize: 16 }}>
          Admin Centre Jeunesse
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Menu Items - Takes available space */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 2, pt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => scrollToSection(item.section, item.ref)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: activeSection === item.section ? '#95D6C2' : 'transparent',
                color: activeSection === item.section ? '#fff' : '#2C3E50',
                '&:hover': {
                  bgcolor: activeSection === item.section ? '#7bc4b0' : '#F1FDF0',
                },
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeSection === item.section ? '#fff' : '#95D6C2',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: activeSection === item.section ? 600 : 500,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Logout Button - Stays at bottom */}
      <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          onClick={() => {
            handleLogout()
          }}
          sx={{
            color: '#e74c3c',
            borderColor: '#e74c3c',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: '#c0392b',
              bgcolor: '#fee',
            },
          }}
        >
          Se Déconnecter
        </Button>
      </Box>
    </Box>
  );

  const StatCard = ({ title, value, subtitle, icon, iconBg }: any) => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        border: '1px solid #E0E0E0',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              bgcolor: iconBg,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          {subtitle && (
            <Chip
              label={subtitle}
              size="small"
              sx={{
                bgcolor: '#95D6C2',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                height: 24,
              }}
            />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: '#2C3E50' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  // Add Maison Dialog
  const AddMaisonDialog = () => (
    <Dialog open={openAddMaisonDialog} onClose={() => setOpenAddMaisonDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#F8F9FA', fontWeight: 600 }}>
        <Box display="flex" alignItems="center">
          <Business sx={{ mr: 1, color: '#95D6C2' }} />
          Ajouter une Maison de Jeunes
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de la Maison de Jeunes"
              placeholder="Ex: Maison de Jeunes El Hana"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Wilaya"
              variant="outlined"
            >
              {wilayas.map((wilaya) => (
                <MenuItem key={wilaya} value={wilaya}>
                  {wilaya}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Commune"
              placeholder="Ex: Bab El Oued"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              placeholder="Ex: 12 Rue de la Liberté"
              variant="outlined"
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: '#95D6C2' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              placeholder="Ex: 021 45 67 89"
              variant="outlined"
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: '#95D6C2' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Ex: contact@mdj-elhana.dz"
              variant="outlined"
              type="email"
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: '#95D6C2' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Directeur(trice)"
              variant="outlined"
            >
              <MenuItem value="">Sélectionner un directeur</MenuItem>
              {admins.filter(a => a.role.includes('Directeur') || a.role.includes('Directrice')).map((admin) => (
                <MenuItem key={admin.id} value={admin.id}>
                  {admin.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              placeholder="Description de la maison de jeunes..."
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
        <Button onClick={() => setOpenAddMaisonDialog(false)} sx={{ color: '#6B7280' }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#95D6C2',
            '&:hover': { bgcolor: '#7bc4b0' },
            textTransform: 'none',
            px: 3,
          }}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add Admin Dialog
  const AddAdminDialog = () => (
    <Dialog open={openAddAdminDialog} onClose={() => setOpenAddAdminDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#F8F9FA', fontWeight: 600 }}>
        <Box display="flex" alignItems="center">
          <PersonAdd sx={{ mr: 1, color: '#95D6C2' }} />
          Ajouter un Administrateur
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Prénom" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nom" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" type="email" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Rôle"
              variant="outlined"
            >
              <MenuItem value="Super-Admin">Super-Admin</MenuItem>
              <MenuItem value="Directeur de centre">Directeur de centre</MenuItem>
              <MenuItem value="Directrice de centre">Directrice de centre</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Téléphone" variant="outlined" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
        <Button onClick={() => setOpenAddAdminDialog(false)} sx={{ color: '#6B7280' }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#95D6C2',
            '&:hover': { bgcolor: '#7bc4b0' },
            textTransform: 'none',
            px: 3,
          }}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#fff',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: '#2C3E50' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#2C3E50', fontWeight: 600 }}>
            Tableau de bord Super-Admin
          </Typography>
          <IconButton sx={{ color: '#95D6C2', mr: 1 }}>
            <Notifications />
          </IconButton>
          <Avatar sx={{ bgcolor: '#95D6C2', width: 36, height: 36, fontSize: 14 }}>AB</Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            width: desktopOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          width: {
            xs: '100%',
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Dashboard Stats Section */}
        <Box ref={dashboardRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Aperçu Global
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Maisons de Jeunes Totales"
                value={adminData?.centersount?.length || 220}
                subtitle="+3 nouvelles"
                icon={<Business sx={{ fontSize: 28, color: '#95D6C2' }} />}
                iconBg="#95D6C215"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Utilisateurs Totaux"
                value={adminData?.userCount?.length || 12500}
                subtitle="+1.2%"
                icon={<People sx={{ fontSize: 28, color: '#95D6C2' }} />}
                iconBg="#95D6C215"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Événements Totaux"
                value={adminData?.eventCount?.length || 450}
                subtitle="+15"
                icon={<CalendarMonth sx={{ fontSize: 28, color: '#95D6C2' }} />}
                iconBg="#95D6C215"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Clubs Totaux"
                value={adminData?.clubcount?.length || 120}
                subtitle="+3 clubs"
                icon={<People sx={{ fontSize: 28, color: '#4AB0E6' }} />}
                iconBg="#4AB0E615"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Ateliers Totaux"
                value={adminData?.workshops?.length || 75}
                subtitle="8 planifiés"
                icon={<CalendarMonth sx={{ fontSize: 28, color: '#F59E0B' }} />}
                iconBg="#F59E0B15"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="Membres de Clubs"
                value={adminData?.clubMembers?.length || 2500}
                subtitle="+250"
                icon={<People sx={{ fontSize: 28, color: '#A855F7' }} />}
                iconBg="#A855F715"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Analytics Section */}
        <Box ref={analyticsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Tendances et Statistiques
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Inscription des Utilisateurs (Mensuel)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Nombre de nouveaux utilisateurs et d'utilisateurs actifs
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userRegistrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="new" stroke="#95D6C2" strokeWidth={3} />
                      <Line type="monotone" dataKey="active" stroke="#333" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <Box display="flex" justifyContent="center" gap={3} mt={2}>
                    <Box display="flex" alignItems="center">
                      <Box width={12} height={12} borderRadius="50%" bgcolor="#95D6C2" mr={1} />
                      <Typography variant="caption">Nouveaux Utilisateurs</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Box width={12} height={12} borderRadius="50%" bgcolor="#333" mr={1} />
                      <Typography variant="caption">Utilisateurs Actifs</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Participation aux Événements
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Répartition des participants par catégorie
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventParticipationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {eventParticipationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2} justifyContent="center">
                    {eventParticipationData.map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.name} (${item.value}%)`}
                        size="small"
                        sx={{
                          bgcolor: `${item.color}20`,
                          color: item.color,
                          fontWeight: 500,
                          fontSize: 11,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Maisons de Jeunes Section */}
        <Box ref={centresRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Maisons de Jeunes
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les maisons de jeunes et leurs informations
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenAddMaisonDialog(true)}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Ajouter Maison de Jeunes
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Wilaya</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', lg: 'table-cell' } }}>Commune</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', lg: 'table-cell' } }}>Directeur(trice)</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Membres</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maisonsDeJeunes.map((maison) => (
                      <TableRow key={maison.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: '#95D6C2', width: 32, height: 32, mr: 1.5, fontSize: 12 }}>
                              <Business fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{maison.name}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: { md: 'none' } }}>
                                {maison.wilaya}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Typography variant="body2">{maison.wilaya}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Typography variant="body2" color="text.secondary">{maison.commune}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Typography variant="body2">{maison.director}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={maison.members}
                            size="small"
                            icon={<People sx={{ fontSize: 14 }} />}
                            sx={{
                              bgcolor: '#F1FDF0',
                              color: '#2C3E50',
                              fontWeight: 500,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Chip
                            label={maison.status}
                            size="small"
                            sx={{
                              bgcolor: maison.status === 'Actif' ? '#D1FAE5' : '#F3F4F6',
                              color: maison.status === 'Actif' ? '#047857' : '#6B7280',
                              fontWeight: 500,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#6B7280' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#EF4444' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Events Section */}
        <Box ref={eventsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Aperçu des Événements
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Section des événements - Contenu à venir
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Users Management Section */}
        <Box ref={usersRef}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Administrateurs
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les administrateurs et leurs accès
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setOpenAddAdminDialog(true)}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Ajouter Administrateur
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Rôle</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', lg: 'table-cell' } }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', xl: 'table-cell' } }}>Dernière Connexion</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: '#95D6C2', width: 32, height: 32, mr: 1.5, fontSize: 12 }}>
                              {admin.name.split(' ').map((n) => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2">{admin.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Typography variant="body2" color="text.secondary">{admin.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontSize={12}>{admin.role}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Chip
                            label={admin.status}
                            size="small"
                            sx={{
                              bgcolor: admin.status === 'Actif' ? '#D1FAE5' : admin.status === 'Inactif' ? '#F3F4F6' : '#FEE2E2',
                              color: admin.status === 'Actif' ? '#047857' : admin.status === 'Inactif' ? '#6B7280' : '#DC2626',
                              fontWeight: 500,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', xl: 'table-cell' } }}>
                          <Typography variant="caption" color="text.secondary">{admin.lastLogin}</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#6B7280' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#EF4444' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Dialogs */}
      <AddMaisonDialog />
      <AddAdminDialog />
    </Box>
  );
}
