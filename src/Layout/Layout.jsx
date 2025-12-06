import Navbar from './Navbar';
import Footer from './Footer'


const Layout = ({ children }) => {


  return (
    <>
      <Navbar />
        <main>
          <div className='main-contenedor'>
            {children}
          </div>
        </main>
      <Footer />
    </>
  );
};

export default Layout;
