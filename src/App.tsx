import "./App.css";
import About from "./components/about";
import Footer from "./components/footer";
import FormSection from "./components/formSection";
import Hero from "./components/hero";
import NavbarMenu from "./components/navbarMenu";
import IndexPage from "./components/test";

function App() {
  return (
    <>
      <NavbarMenu />
      <Hero
        title="Experimente a nossa Calculadora CME"
        subtitle="
          Receba um relatório personalizado e detalhado com recomendações de equipamentos e marcas que atendem perfeitamente às suas necessidades."
      />
      <About />
      <FormSection />
      <Footer />
      {/* <IndexPage /> */}
    </>
  );
}

export default App;
