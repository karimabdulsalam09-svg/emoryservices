const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Right side glows */}
      <div 
        className="absolute -right-[150px] top-[10vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -right-[150px] top-[110vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.42) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -right-[150px] top-[210vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.38) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -right-[150px] top-[310vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      
      {/* Left side glows */}
      <div 
        className="absolute -left-[150px] top-[60vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -left-[150px] top-[160vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.38) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -left-[150px] top-[260vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.42) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -left-[150px] top-[360vh] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
};

export default BackgroundGlows;
