import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';

interface PostProcessingEffects3DProps {
  enabled?: boolean;
}

const PostProcessingEffects3D = ({ enabled = true }: PostProcessingEffects3DProps) => {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      {/* Crisp modern bloom for emissive elements */}
      <Bloom intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.1} mipmapBlur />

      {/* Subtle DoF for cinematic feel */}
      <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={1.2} />

      {/* Gentle vignette */}
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
};

export default PostProcessingEffects3D;
