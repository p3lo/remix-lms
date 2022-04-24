import Footer from './Footer';
import Header from './Header';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <header className="shadow-xl">
        <Header />
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
