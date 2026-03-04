const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top-left olive green mesh */}
      <div
        className="absolute -left-[200px] -top-[200px] w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(82, 29%, 66%, 0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Bottom-right neon blue mesh */}
      <div
        className="absolute -right-[200px] -bottom-[200px] w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Mid-page subtle olive */}
      <div
        className="absolute left-1/2 top-[50vh] -translate-x-1/2 w-[1000px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsla(82, 29%, 66%, 0.1) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
    </div>
  );
};

export default BackgroundGlows;
