import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Profile from './components/Profile';
import Manage from './components/Manage';
import AddReservesDays from './components/Manage/addReservesHistory'
import Search from './components/Search';
import './App.css';
import Navigation from './routes/navigation/navigation';
import { ApolloProvider, client, InMemoryCache,ApolloClient, gql } from '@apollo/client';
import { useEffect, useState , useContext} from 'react';
import MadorManagement from './components/Manage/madorManagement'
import AllUsersList from './components/Manage/users';
import { UserContext} from './context/user.context'
import FavoriteList from './components/Manage/favorites';
import Stats from './components/Manage/stats';
function App({ authState }) {
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRoles] = useState(null)
  const [client_after_init, setClient_after_init] = useState(null)
  const theme = createTheme({
    direction: 'rtl',
  });
  const [userData, setUserData] = useContext(UserContext)
  const headers = authState.status === 'in' ? { Authorization: `Bearer ${authState.token}` } : {};
  const client_pre_init = new ApolloClient({
    uri: 'https://innocent-lemming-13.hasura.app/v1/graphql',
    headers,
    cache: new InMemoryCache()
  });
  useEffect(() => {
    const loadPermission = async () => {
      const data = await client_pre_init.query({
          query: gql`query getMyUser {
            mador_managers {
              mador_id
              manager_id
            }
            mador_members { 
              mador_id
              user_id
            }
          }`
      })
      if (data.data.mador_managers.length !== 0) {
        setRoles('mador_manager')
        setUserData({...userData, roles: ['mador_manager'], mador_id: data.data.mador_managers[0].mador_id})

      }
      if (data.data.mador_members.length !== 0) {
        setRoles('mador_member')
        setUserData({...userData, roles: ['mador_member'], mador_id: data.data.mador_members[0].mador_id})
      }
      setIsLoading(false)
    }
    loadPermission()
  }, [])
  
  useEffect(() => { 
    let newHeaders = headers
    if (role) {
      newHeaders = { ...newHeaders, 'X-Hasura-Role': role}
    }
    setClient_after_init(new ApolloClient({
      uri: 'https://innocent-lemming-13.hasura.app/v1/graphql',
      headers: newHeaders, 
      cache: new InMemoryCache()
    }));

  }, [isLoading])
  return (
    
    client_after_init && 
    <ApolloProvider client={client_after_init}>
      <ThemeProvider theme={theme}> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigation />} >
              <Route index element={<Search />} />
              <Route path="/profile/:personId" element={<Profile />} />
              <Route path="search" element={<Search />} />
              <Route path="manage" element={<Manage />} />
              <Route path='reserve_history/:personId' element={<AddReservesDays  />} />
              <Route path='mymador' element={<MadorManagement />} />
              <Route path='users' element={<AllUsersList />} />
              <Route path='stats' element={<Stats />} />
              <Route path='favorites' element={<FavoriteList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
