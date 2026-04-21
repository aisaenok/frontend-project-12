import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../slices/authSlice.js'
import { removeToken, removeUsername } from '../utils/auth.js'

function Header() {
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
          Hexlet Chat
        </Navbar.Brand>

        {token && (
          <Button variant="primary" onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </Container>
    </Navbar>
  )
}

export default Header
