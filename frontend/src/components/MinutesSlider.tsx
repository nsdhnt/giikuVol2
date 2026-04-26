import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MinutesSlider.css';

interface MinutesSliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
}

const MinutesSlider: React.FC<MinutesSliderProps> = ({
  min = 0,
  max = 100, // 分（Minutes）に合わせてデフォルトを60に設定
  initialValue = 0,
  onChange,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const updateValue = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    // 6時方向(下)を起点にするための計算
    let degree = radians * (180 / Math.PI) - 90;
    
    if (degree < 0) degree += 360;

    // 360度をmax(60分など)の範囲にマッピング
    const calculatedValue = Math.round((degree / 360) * max);
    const newValue = Math.max(min, Math.min(max, calculatedValue));

    setValue(newValue);
    if (onChange) onChange(newValue);
  }, [min, max, onChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateValue(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        updateValue(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const stopDragging = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, updateValue]);

  // 描画用の計算（現在の値を角度に戻す）
  const angleDeg = (value / max) * 360 + 90; 
  const radians = (angleDeg * Math.PI) / 180;
  const thumbX = 50 + radius * Math.cos(radians);
  const thumbY = 50 + radius * Math.sin(radians);
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div 
      className="minutes-slider-container" 
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        updateValue(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        updateValue(e.touches[0].clientX, e.touches[0].clientY);
      }}
    >
      <svg className="minutes-slider-svg" viewBox="0 0 100 100">
        <circle className="minutes-slider-bg" cx="50" cy="50" r={radius} />
        <circle 
          className="minutes-slider-progress" 
          cx="50" 
          cy="50" 
          r={radius} 
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset
          }}
        />
      </svg>
      
      <div 
        className="minutes-slider-thumb" 
        style={{ left: `${thumbX}%`, top: `${thumbY}%` }}
      />
      
      <div className="minutes-value-display">
        {value}<span className="unit">min</span>
      </div>
    </div>
  );
};

export default MinutesSlider;