import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/useAuth.js'
import routes from '../utils/routes.js'

function Header() {
  const token = useSelector(state => state.auth.token)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const auth = useAuth()

  const handleLogout = () => {
    auth.signOut()
    navigate(routes.loginPath(), { replace: true })
  }

  return (
    <Navbar bg="white" className="shadow-sm">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to={routes.chatPath()}>
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
