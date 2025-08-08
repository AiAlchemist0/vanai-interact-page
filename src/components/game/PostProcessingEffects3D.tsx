import { EffectComposer } from '@react-three/postprocessing';

interface PostProcessingEffects3DProps {
  enabled?: boolean;
}

const PostProcessingEffects3D = ({ enabled = true }: PostProcessingEffects3DProps) => {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>{null}</EffectComposer>
  );
};

export default PostProcessingEffects3D;
