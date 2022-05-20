import Footer from '../main-layout/Footer';
import Header from './Header';

function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between max-h-screen">
      <header className="shadow-xl">
        <Header />
      </header>
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}

export default LearningLayout;
