import React, { useEffect, useRef, useState } from 'react';
import logo from './img/melon_logo_2025.png';

const prizes = ["10% de descuento", "Labial gratis", "Brocha de regalo", "Gracias por participar", "20% de descuento"];
const colors = ["#d3c5b8", "#e0d3c4", "#c9b8a0", "#eee7dc", "#b8a897"];

const Roulette = () => {
  const [hasSpun, setHasSpun] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const canvasRef = useRef(null);
  const [rotationDeg, setRotationDeg] = useState(0);

  useEffect(() => {
    const alreadySpun = localStorage.getItem('hasSpun') || getCookie('hasSpun');
    if (alreadySpun) {
      setHasSpun(true);
      const savedPrize = localStorage.getItem('selectedPrize');
      if (savedPrize) setSelectedPrize(savedPrize);
    } else {
      drawWheel();
    }
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 300;
    const center = size / 2;
    const angle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < prizes.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(center, center);
      ctx.arc(center, center, center, angle * i, angle * (i + 1));
      ctx.fill();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle * i + angle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1f1f1f';
      ctx.font = '14px Arial';
      ctx.fillText(prizes[i], center - 10, 5);
      ctx.restore();
    }
  };

  const setCookie = (name, value, days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const spin = () => {
    if (hasSpun || spinning) return;
    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const anglePerPrize = 360 / prizes.length;
    const targetAngle = 360 * 5 + (360 - anglePerPrize * randomIndex - anglePerPrize / 2); // correct pointer
    setRotationDeg(targetAngle);

    setTimeout(() => {
      const prize = prizes[randomIndex];
      setSelectedPrize(prize);
      setHasSpun(true);
      localStorage.setItem('hasSpun', 'true');
      localStorage.setItem('selectedPrize', prize);
      setCookie('hasSpun', true, 365);
      setSpinning(false);
    }, 4000);
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo de la tienda" style={styles.logo} />
      <h1 style={{ marginBottom: '20px' }}>🎉 Girá la ruleta y descubrí tu premio</h1>

      {!hasSpun && (
        <div style={{ position: 'relative', width: '300px', height: '300px' }}>
          <div style={{ position: 'absolute', top: 'calc(5% - 10px)', left: '50%', zIndex: 3, transform: 'translate(-50%, -50%)' }}>
            🔻
          </div>
          <canvas
            ref={canvasRef}
            width="300"
            height="300"
            style={{
              marginTop: '10px',
              transition: 'transform 4s ease-out',
              transform: `rotate(${rotationDeg}deg)`
            }}
          />
        </div>
      )}

      <button
        onClick={spin}
        disabled={hasSpun || spinning}
        style={hasSpun || spinning ? styles.buttonDisabled : styles.button}
      >
        {spinning ? 'Girando...' : hasSpun ? 'Ya participaste ✨' : 'Girar'}
      </button>

      {hasSpun && selectedPrize && (
        <h2 style={{ marginTop: '20px' }}>🎉 ¡Ganaste: {selectedPrize}!</h2>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f0e6',
    color: '#1f1f1f',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  logo: {
    width: '150px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#1f1f1f',
    color: '#f5f0e6',
    padding: '12px 24px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    borderRadius: '8px',
  },
  buttonDisabled: {
    backgroundColor: '#888',
    color: '#f5f0e6',
    padding: '12px 24px',
    border: 'none',
    fontSize: '16px',
    marginTop: '20px',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
};

export default Roulette;
