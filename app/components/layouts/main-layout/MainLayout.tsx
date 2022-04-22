import Footer from './Footer';
import Header from './Header';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b">
        <Header />
      </header>
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
