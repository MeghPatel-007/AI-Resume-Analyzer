import Navbar from './Navbar';
import Footer from './Footer';

const PageLayout = ({ children, noFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
