import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logOut } from '../slices/authSlice.js'
import { removeToken, removeUsername } from '../utils/auth.js'

function Header() {
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = () => {
    removeToken()
    removeUsername()
    dispatch(logOut())
    navigate('/login', { replace: true })
  }

  return (
    <Navbar bg="white" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('common.appName')}
        </Navbar.Brand>

        {token && (
          <Button variant="primary" onClick={handleLogout}>
            {t('common.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
