import { useEffect } from 'react';
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser, reset } from "../features/authSlice.js"

const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const { user } = useSelector((state)=> state.auth);

    const logOut = () => {
        dispatch(logoutUser());
        dispatch(reset());
        navigate("/")
    };

    useEffect(() => {
        const handleMenuClick = () => {
            const navLinks = document.getElementById('nav-links');
            const hamburguesa = document.querySelector('.hamburguesa');

            navLinks.classList.toggle('hide');
            hamburguesa.classList.toggle('lineas-rotate');
        };

        const handleLinkClick = () => {
            const navLinks = document.getElementById('nav-links');
            navLinks.classList.toggle('hide');
        };

        const hamburguesa = document.querySelector('.hamburguesa');
        hamburguesa.addEventListener('click', handleMenuClick);

        const links = document.querySelectorAll('.links');
        links.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        return () => {
            hamburguesa.removeEventListener('click', handleMenuClick);
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
            });
        };
    }, []);



    return (
        <>
            <header>
                <nav className="nav-contenedor">
                    <h1 id="logo">MIS FINANZAS</h1>
                    <div className="hamburguesa">
                        <span className="lineas" />
                        <span className="lineas" />
                        <span className="lineas" />
                    </div>
                    <ul id="nav-links" className='nav-links-items'>
                        <li className='nav-list-item'>
                            <Link to={"/paginaPrincipal"} className="links">
                                INICIO
                            </Link>
                        </li>
                        <li className='nav-list-item'>
                            <Link to={"/ingresos"} className="links">
                                INGRESOS
                            </Link>
                        </li>
                        <li className='nav-list-item'>
                            <Link to={"/egresos"} className="links">
                                EGRESOS
                            </Link>
                        </li>
                        <li className='nav-list-item'>
                            <Link to={"/conceptos"} className="links">
                                CONCEPTOS
                            </Link>
                        </li>
                        <li className='nav-list-item'>
                            <Link className="links">
                                PERFIL
                            </Link>
                        </li>
                        <li className='nav-list-item'>
                            <Link to={"/"} onClick={logOut} className="links">
                                SALIR
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Navbar