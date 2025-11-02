import { useEffect, useState, useRef, use } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  ChevronLeft as ChevronLeftIcon,
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
  BarChart,
  Bar,
} from 'recharts';

import {AdminDashboard, logout} from '../services/api.js'
import { useNavigate } from 'react-router-dom';
const drawerWidth = 280;

export default function Admin() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData , setAdminData] = useState(null)

  useEffect(()=>{
    const fetchData = async()=>{
      const data = await AdminDashboard()
      setAdminData(data)
    }
    fetchData()
  },[])
  console.log(adminData);
  
  async function handlelogout(){
    await logout()
    navigate('/')
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for scrolling to sections
  const dashboardRef = useRef<HTMLDivElement>(null);
  const inscriptionsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const clubsRef = useRef<HTMLDivElement>(null);
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

  const directorRegistrationData = [
    { month: 'Jan', value: 100 },
    { month: 'Fév', value: 108 },
    { month: 'Mar', value: 118 },
    { month: 'Avr', value: 128 },
    { month: 'Mai', value: 135 },
    { month: 'Juin', value: 145 },
    { month: 'Juil', value: 152 },
    { month: 'Août', value: 148 },
    { month: 'Sep', value: 155 },
    { month: 'Oct', value: 160 },
    { month: 'Nov', value: 163 },
    { month: 'Déc', value: 165 },
  ];

  const clubDistributionData = [
    { name: 'Club Musique', value: 25, color: '#4AB0E6' },
    { name: 'Club Théâtre', value: 15, color: '#A855F7' },
    { name: 'Club Sport', value: 30, color: '#10B981' },
    { name: 'Club Lecture', value: 10, color: '#F59E0B' },
  ];

  const eventParticipationBarData = [
    { name: 'Atelier Codage', value: 30 },
    { name: 'Séance Ciné', value: 50 },
    { name: 'Tournoi E-sport', value: 70 },
    { name: 'Journées PO', value: 20 },
    { name: 'Cours Cuisine', value: 45 },
  ];

  const events = [
    { id: 1, name: 'Atelier de Codage', date: '15/03/2024', location: 'Salle Polyvalente', participants: 25 },
    { id: 2, name: 'Séance de Ciné-club', date: '22/03/2024', location: 'Auditorium', participants: 40 },
    { id: 3, name: 'Tournoi de E-sport', date: '05/04/2024', location: 'Salle Informatique', participants: 30 },
    { id: 4, name: 'Journée Portes Ouvertes', date: '10/04/2024', location: 'Entrée Principale', participants: 60 },
    { id: 5, name: 'Cours de Cuisine Algérienne', date: '18/04/2024', location: 'Cuisine Pédagogique', participants: 15 },
  ];

  const clubs = [
    { id: 1, name: 'Club Musique', activity: 'Pratique instrumentale, Chorale', members: 25 },
    { id: 2, name: 'Club Théâtre', activity: 'Improvisation, Pièces de théâtre', members: 15 },
    { id: 3, name: 'Club Sport', activity: 'Football, Basket-ball, Athlétisme', members: 30 },
    { id: 4, name: 'Club Lecture', activity: 'Débats littéraires, Échanges de livres', members: 10 },
  ];

  const menuItems = [
    { text: 'Mon Tableau de Bord', icon: <HomeIcon />, section: 'dashboard', ref: dashboardRef },
    { text: 'Inscriptions des Jeunes', icon: <PeopleIcon />, section: 'inscriptions', ref: inscriptionsRef },
    { text: 'Gestion des Événements', icon: <CalendarIcon />, section: 'events', ref: eventsRef },
    { text: 'Gestion des Clubs', icon: <PeopleIcon />, section: 'clubs', ref: clubsRef },
    { text: 'Analyses', icon: <BarChartIcon />, section: 'analytics', ref: analyticsRef },
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
            handlelogout()
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

  const StatCard = ({ title, value, icon, color }: any) => (
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
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box 
            sx={{ 
              bgcolor: `${color}15`,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <CssBaseline />
      
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
            Tableau de Bord du Directeur
          </Typography>
          <IconButton sx={{ color: '#95D6C2', mr: 1 }}>
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: '#95D6C2', width: 36, height: 36, fontSize: 14 }}>FZ</Avatar>
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
        
        {/* Desktop Drawer - Permanent */}
        {/* Desktop Drawer - Permanent */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: desktopOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: desktopOpen ? drawerWidth : 0,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: desktopOpen ? '2px 0 8px rgba(0,0,0,0.05)' : 'none',
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
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
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
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Jeunes Inscrits"
                value="150"
                icon={<PeopleIcon sx={{ fontSize: 28, color: '#95D6C2' }} />}
                color="#95D6C2"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Événements Actifs"
                value="25"
                icon={<CalendarIcon sx={{ fontSize: 28, color: '#F59E0B' }} />}
                color="#F59E0B"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Clubs du Centre"
                value="5"
                icon={<HomeIcon sx={{ fontSize: 28, color: '#4AB0E6' }} />}
                color="#4AB0E6"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Membres de Clubs"
                value="80"
                icon={<PeopleIcon sx={{ fontSize: 28, color: '#A855F7' }} />}
                color="#A855F7"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Analytics Section */}
        <Box ref={analyticsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Analyses et Statistiques
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Évolution des Inscriptions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Tendances mensuelles pour votre centre
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={directorRegistrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#95D6C2" strokeWidth={3} dot={{ fill: '#95D6C2', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Répartition par Club
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Distribution des membres
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie 
                        data={clubDistributionData} 
                        dataKey="value" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={90}
                      >
                        {clubDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2} justifyContent="center">
                    {clubDistributionData.map((item, index) => (
                      <Chip 
                        key={index}
                        label={item.name}
                        size="small"
                        sx={{ 
                          bgcolor: `${item.color}20`,
                          color: item.color,
                          fontWeight: 500,
                          fontSize: 11
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} sx={{ mt: 3, borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Participation aux Événements
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Nombre de participants par événement
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventParticipationBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Inscriptions Section */}
        <Box ref={inscriptionsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Inscriptions des Jeunes
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Section des inscriptions - Contenu à venir
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Events Section */}
        <Box ref={eventsRef} mb={4}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Événements
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Affichez et gérez les événements de votre centre
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouvel Événement
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Lieu</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Participants</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{event.location}</TableCell>
                        <TableCell>{event.participants}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            sx={{
                              color: '#95D6C2',
                              borderColor: '#95D6C2',
                              '&:hover': {
                                borderColor: '#7bc4b0',
                                bgcolor: '#F1FDF0'
                              },
                              textTransform: 'none',
                              fontSize: 12
                            }}
                          >
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Clubs Section */}
        <Box ref={clubsRef}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#2C3E50' }}>
            Gestion des Clubs
          </Typography>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Gérez les clubs de votre maison de jeunes
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: '#95D6C2',
                    '&:hover': { bgcolor: '#7bc4b0' },
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Nouveau Club
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Nom du Club</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>Activité</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Membres</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clubs.map((club) => (
                      <TableRow key={club.id} hover>
                        <TableCell>{club.name}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{club.activity}</TableCell>
                        <TableCell>{club.members}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            sx={{
                              color: '#95D6C2',
                              borderColor: '#95D6C2',
                              '&:hover': {
                                borderColor: '#7bc4b0',
                                bgcolor: '#F1FDF0'
                              },
                              textTransform: 'none',
                              fontSize: 12
                            }}
                          >
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}