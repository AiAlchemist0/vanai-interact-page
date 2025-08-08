// This module sanitizes props passed to React Three Fiber intrinsic elements to avoid
// unknown attributes like data-* being forwarded to Three.js objects, which can
// crash applyProps by trying to traverse dashed keys (e.g., data-lov-id).
// It patches React.createElement once, early in app startup.

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// A minimal whitelist of R3F intrinsic element names used in this project.
// We only filter for these so DOM elements keep their data-* attributes
// (Radix UI relies on data-state, etc.).
const R3F_INTRINSICS = new Set<string>([
  'group',
  'mesh',
  'gridHelper',
  'pointLight',
  'spotLight',
  'ambientLight',
  'directionalLight',
  'hemisphereLight',
  'perspectiveCamera',
  'orthographicCamera',
  'boxGeometry',
  'planeGeometry',
  'sphereGeometry',
  'cylinderGeometry',
  'ringGeometry',
  'circleGeometry',
  'coneGeometry',
  'tubeGeometry',
  'torusGeometry',
  'torusKnotGeometry',
  'dodecahedronGeometry',
  'octahedronGeometry',
  'tetrahedronGeometry',
  'icosahedronGeometry',
  'capsuleGeometry',
  'extrudeGeometry',
  'latheGeometry',
  'shapeGeometry',
  'textGeometry',
  'bufferGeometry',
  'instancedMesh',
  'line',
  'points',
  'primitive',
  'meshStandardMaterial',
  'meshBasicMaterial',
  'meshPhongMaterial',
  'meshPhysicalMaterial',
  'meshLambertMaterial',
  'shaderMaterial',
  'rawShaderMaterial',
  'lineBasicMaterial',
]);

// Prevent double-patching in hot reload scenarios
if (typeof window !== 'undefined' && !(window as any).__r3fSanitized) {
  (window as any).__r3fSanitized = true;
  const origCreateElement = React.createElement as any;
  (React as any).createElement = (type: any, props?: any, ...children: any[]) => {
    if (props && typeof type === 'string' && R3F_INTRINSICS.has(type)) {
      const sanitized: any = {};
      for (const key in props) {
        // Drop attributes that are meaningless or harmful on Three objects
        // - Any dashed props (e.g., lov-id, data-*, aria-*) can crash applyProps
        if (key.includes('-') || key.startsWith('data-') || key.startsWith('aria-')) continue;
        sanitized[key] = props[key];
      }
      return origCreateElement(type, sanitized, ...children);
    }
    return origCreateElement(type, props, ...children);
  };
}
