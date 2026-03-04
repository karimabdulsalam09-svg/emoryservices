const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top-left olive green mesh — stronger */}
      <div
        className="absolute -left-[100px] -top-[100px] w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(82, 40%, 66%, 0.4) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Top-right neon blue */}
      <div
        className="absolute -right-[100px] -top-[50px] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.2) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Bottom-right neon blue mesh — stronger */}
      <div
        className="absolute -right-[100px] -bottom-[100px] w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.3) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Bottom-left olive */}
      <div
        className="absolute -left-[100px] -bottom-[100px] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(82, 40%, 66%, 0.25) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Mid-page accent blobs */}
      <div
        className="absolute left-1/3 top-[40vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute right-1/3 top-[70vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(82, 40%, 66%, 0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
};

export default BackgroundGlows;
