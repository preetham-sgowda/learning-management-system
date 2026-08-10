import React, { useEffect, useRef } from 'react';

const BackgroundShader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const syncSize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    window.addEventListener('resize', syncSize);
    syncSize();

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = v_texCoord;
          float time = u_time * 0.25;
          
          // Dark background #0B0F17
          vec3 baseColor = vec3(0.043, 0.059, 0.09);
          
          // Deep crimson blob (#810B38)
          vec2 p1 = vec2(0.4 + 0.25 * sin(time * 1.1), 0.5 + 0.2 * cos(time * 0.9));
          float d1 = length(uv - p1);
          float blob1 = smoothstep(0.65, 0.0, d1);
          vec3 crimson = vec3(0.505, 0.043, 0.22);
          
          // Cyan highlight blob (#06B6D4)
          vec2 p2 = vec2(0.7 + 0.2 * cos(time * 1.3), 0.3 + 0.25 * sin(time * 0.7));
          float d2 = length(uv - p2);
          float blob2 = smoothstep(0.55, 0.0, d2);
          vec3 cyan = vec3(0.023, 0.713, 0.831);
          
          vec3 finalColor = baseColor + crimson * blob1 * 0.8 + cyan * blob2 * 0.4;
          
          // Subtle grid mesh overlay
          vec2 grid = abs(fract(uv * 25.0 - 0.5) - 0.5) / fwidth(uv * 25.0);
          float line = min(grid.x, grid.y);
          float mesh = 1.0 - min(line, 1.0);
          finalColor += vec3(0.04, 0.08, 0.12) * mesh * 0.15;
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');

    let startTime = performance.now();

    const render = (now) => {
      syncSize();
      gl.useProgram(program);

      gl.enableVertexAttribArray(aPosition);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTime, (now - startTime) * 0.001);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
    />
  );
};

export default BackgroundShader;
