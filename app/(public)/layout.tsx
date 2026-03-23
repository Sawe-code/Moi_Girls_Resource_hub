import Navbar from "@/components/Navbar";
import LightRays from "@/components/LightRays";
import Footer from "@/components/Footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
        <LightRays
          raysOrigin="top-center-offset"
          raysColor="#800020"
          raysSpeed={0.15}
          lightSpread={0.6}
          rayLength={1.2} 
          followMouse={true}
          mouseInfluence={0.01}
          noiseAmount={0.0}
          distortion={0.0}
        />
      </div>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
