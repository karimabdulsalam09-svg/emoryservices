const BackgroundGlows = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Right side glows */}
      <div 
        className="absolute -right-[200px] top-[10vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -right-[200px] top-[110vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -right-[200px] top-[210vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -right-[200px] top-[310vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Left side glows */}
      <div 
        className="absolute -left-[200px] top-[60vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.28) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -left-[200px] top-[160vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -left-[200px] top-[260vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -left-[200px] top-[360vh] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.28) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
};

export default BackgroundGlows;
